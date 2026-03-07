package com.Farm360.service.supply;

import com.Farm360.dto.request.supply.*;
import com.Farm360.dto.response.supply.SupplyExecutionOrderRS;
import com.Farm360.mapper.supply.SupplyExecutionOrderMapper;
import com.Farm360.model.SupplierEntity;
import com.Farm360.model.agreement.AgreementEntity;
import com.Farm360.model.master.items.SupplyItemName;
import com.Farm360.model.payment.AgreementEscrowAllocation;
import com.Farm360.model.supply.*;
import com.Farm360.repository.agreement.AgreementRepo;
import com.Farm360.repository.master.items.SupplyItemNameRepository;
import com.Farm360.repository.supplier.SupplierRepo;
import com.Farm360.repository.supply.SupplyExecutionItemRepository;
import com.Farm360.repository.supply.SupplyExecutionOrderRepository;
import com.Farm360.service.agreement.AgreementEscrowAllocationService;
import com.Farm360.service.agreement.AgreementService;
import com.Farm360.service.escrow.EscrowService;
import com.Farm360.service.notification.NotificationService;
import com.Farm360.utils.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class SupplyExecutionServiceImpl implements SupplyExecutionService {

    @Autowired private SupplyExecutionOrderRepository orderRepo;
    @Autowired private SupplyExecutionItemRepository itemRepo;
    @Autowired private AgreementEscrowAllocationService allocationService;
    @Autowired private EscrowService escrowService;
    @Autowired private SupplierRepo supplierRepo;
    @Autowired private SupplyExecutionOrderMapper supplyMapper;
    @Autowired private AgreementService agreementService;
    @Autowired private SupplyItemNameRepository itemNameRepo;
    @Autowired private NotificationService notificationService;
    @Autowired private SupplierBroadcastResolver supplierBroadcastResolver;
    @Autowired private AgreementRepo agreementRepo;

    @Override
    public SupplyExecutionOrderRS getOrder(Long orderId) {
        SupplyExecutionOrderEntity order =
                orderRepo.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        return supplyMapper.mapEntityToRS(order);
    }

    @Override
    public List<SupplyExecutionOrderRS> getMyOrders(Long userId, String role) {
        List<SupplyExecutionOrderEntity> orders;

        switch (role.toUpperCase()) {
            case "SUPPLIER" -> orders = orderRepo.findBySupplierUserId(userId);

            case "FARMER" -> {
                List<Long> ids = agreementRepo.findByFarmerUserId(userId)
                        .stream().map(a -> a.getAgreementId()).toList();
                orders = ids.isEmpty() ? List.of() : orderRepo.findByAgreement_AgreementIdIn(ids);
            }

            case "BUYER" -> {
                List<Long> ids = agreementRepo.findByBuyerUserId(userId)
                        .stream().map(a -> a.getAgreementId()).toList();
                orders = ids.isEmpty() ? List.of() : orderRepo.findByAgreement_AgreementIdIn(ids);
            }

            default -> orders = List.of();
        }

        return orders.stream().map(supplyMapper::mapEntityToRS).toList();
    }

    @Override
    public List<SupplyExecutionOrderRS> getAvailableOrders(Long supplierUserId) {
        SupplierEntity supplier =
                supplierRepo.findByUser_Id(supplierUserId)
                        .orElseThrow(() -> new RuntimeException("Supplier not found"));
        return orderRepo.findBroadcastRequestsForSupplierType(supplier.getSupplierType())
                .stream().map(supplyMapper::mapEntityToRS).toList();
    }

    // ═══════════════════════════════════════════════════════════════
    //  EXISTING METHODS (unchanged)
    // ═══════════════════════════════════════════════════════════════

    @Override
    public SupplyExecutionOrderRS createAdvanceSupply(SupplyExecutionCreateRQ rq, Long userId) {

        AgreementEscrowAllocation alloc = allocationService.getByAgreementId(rq.getAgreementId());
        double available = getAvailableEscrowByStage(alloc, rq.getStage());

        if (rq.getDemandAmount() == null || rq.getDemandAmount() <= 0)
            throw new RuntimeException("Demand amount is required");
        if (rq.getDemandAmount() > available)
            throw new RuntimeException("Demand amount exceeds available escrow for " + rq.getStage());
        if (available <= 0)
            throw new RuntimeException("Escrow exhausted for " + rq.getStage());

        List<Long> supplierUserIds = supplierBroadcastResolver.resolveSuppliers(rq.getSupplierType());

        AgreementEntity agreement =
                agreementRepo.findById(rq.getAgreementId())
                        .orElseThrow(() -> new RuntimeException("Agreement not found"));
        SupplyExecutionOrderEntity order = SupplyExecutionOrderEntity.builder()
                .agreement(agreement)
                .proposalVersion(rq.getProposalVersion())
                .stage(rq.getStage())
                .supplierUserId(null)
                .supplierType(rq.getSupplierType())
                .allocatedAmount(rq.getDemandAmount())
                .status(SupplyStatus.SUPPLIER_NOTIFIED)
                .escrowStatus(EscrowReleaseStatus.HELD)
                .expectedDeliveryDate(rq.getExpectedDeliveryDate())
                .build();

        order = orderRepo.saveAndFlush(order);

        for (Long supplierId : supplierUserIds) {
            notificationService.notifyUser(supplierId, NotificationType.SUPPLY_REQUEST,
                    "New Supply Request",
                    "A farmer needs " + rq.getSupplierType() + " materials",
                    order.getId());
        }

        Long buyerId = allocationService.getByAgreementId(order.getAgreement().getAgreementId()).getBuyerUserId();
        notificationService.notifyUser(buyerId, NotificationType.SUPPLY_REQUEST_CREATED,
                "Supply Requested",
                "Farmer requested materials for stage " + order.getStage(),
                order.getId());

        SupplyExecutionOrderEntity finalOrder = order;
        rq.getItems().forEach(i -> {
            if (i.getType() == SupplyItemType.OTHER
                    && i.getProductName() != null && !i.getProductName().isBlank()) {
                boolean exists = itemNameRepo.existsBySupplierTypeAndNameIgnoreCase(
                        rq.getSupplierType(), i.getProductName());
                if (!exists) {
                    itemNameRepo.save(SupplyItemName.builder()
                            .supplierType(rq.getSupplierType())
                            .name(i.getProductName())
                            .active(true)
                            .build());
                }
            }
            itemRepo.save(SupplyExecutionItemEntity.builder()
                    .order(finalOrder)
                    .type(i.getType())
                    .brandName(i.getBrandName())
                    .productName(i.getProductName())
                    .quantity(i.getQuantity())
                    .unit(i.getUnit())
                    .expectedPrice(i.getExpectedPrice())
                    .build());
        });

        return supplyMapper.mapEntityToRS(order);
    }

    @Override
    public SupplyExecutionOrderRS supplierAccept(Long orderId, Long supplierUserId) {
        SupplyExecutionOrderEntity order =
                orderRepo.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getSupplierUserId() != null)
            throw new RuntimeException("Order already accepted by another supplier");

        SupplierEntity supplier =
                supplierRepo.findByUser_Id(supplierUserId)
                        .orElseThrow(() -> new RuntimeException("Supplier not found"));
        if (supplier.getSupplierType() != order.getSupplierType())
            throw new RuntimeException("Wrong supplier type");

        order.setSupplierUserId(supplierUserId);
        order.setStatus(SupplyStatus.SUPPLIER_ACCEPTED);
        orderRepo.save(order);

        Long farmerId = allocationService.getByAgreementId(order.getAgreement().getAgreementId()).getFarmerUserId();
        notificationService.notifyUser(farmerId, NotificationType.SUPPLIER_ACCEPTED,
                "Supplier Accepted", "A supplier has accepted your request", order.getId());

        return supplyMapper.mapEntityToRS(order);
    }

    @Override
    public SupplyExecutionOrderRS uploadSupplierBill(SupplierBillUploadRQ rq, Long supplierUserId) {
        SupplyExecutionOrderEntity order = orderRepo.findById(rq.getOrderId()).orElseThrow();

        if (order.getStatus() != SupplyStatus.SUPPLIER_ACCEPTED)
            throw new RuntimeException("Order not accepted yet");
        if (!order.getSupplierUserId().equals(supplierUserId))
            throw new RuntimeException("Unauthorized supplier");

        SupplierInvoice invoice = new SupplierInvoice();
        invoice.setOrder(order);
        invoice.setInvoiceNumber(rq.getInvoiceNumber());
        invoice.setDeliveryCharge(rq.getDeliveryCharge());
        invoice.setInvoicePhotoUrl(rq.getInvoicePhotoUrl());

        double total = 0.0;
        List<SupplierInvoiceItem> items = new ArrayList<>();
        for (InvoiceItemRQ itemRQ : rq.getItems()) {
            SupplierInvoiceItem item = new SupplierInvoiceItem();
            item.setInvoice(invoice);
            item.setDescription(itemRQ.getDescription());
            item.setQuantity(itemRQ.getQuantity());
            item.setRate(itemRQ.getRate());
            item.setUnit(itemRQ.getUnit());
            double amount = itemRQ.getQuantity() * itemRQ.getRate();
            item.setAmount(amount);
            total += amount;
            items.add(item);
        }

        double deliveryCharge = rq.getDeliveryCharge() == null ? 0 : rq.getDeliveryCharge();
        total += deliveryCharge;
        double itemTotal = total - deliveryCharge;

        if (deliveryCharge > itemTotal * 0.25)
            throw new RuntimeException("Delivery charge exceeds allowed limit (25%)");

        invoice.setTotalAmount(total);
        invoice.setItems(items);
        order.setInvoice(invoice);

        if (rq.getProofs() != null) {
            if (order.getProofs() == null) {
                order.setProofs(new ArrayList<>());
            } else {
                order.getProofs().clear();
            }
            for (ProofUploadRQ p : rq.getProofs()) {
                SupplyProof proof = new SupplyProof();
                proof.setOrder(order);
                proof.setType(p.getType());
                proof.setFileUrl(p.getFileUrl());
                proof.setMetadata(p.getMetadata());
                order.getProofs().add(proof);  // ← add to existing collection
            }
        }

        order.setBillAmount(total);
        order.setPayableAmount(total);
        order.setStatus(SupplyStatus.DISPATCHED);

        Long farmerId = allocationService.getByAgreementId(order.getAgreement().getAgreementId()).getFarmerUserId();
        notificationService.notifyUser(farmerId, NotificationType.SUPPLY_DISPATCHED,
                "Supply Dispatched", "Your farming materials are on the way", order.getId());

        Long buyerId = allocationService.getByAgreementId(order.getAgreement().getAgreementId()).getBuyerUserId();
        notificationService.notifyUser(buyerId, NotificationType.SUPPLIER_BILL_UPLOADED,
                "Supplier Bill Uploaded", "Supplier uploaded bill for verification", order.getId());

        return supplyMapper.mapEntityToRS(orderRepo.save(order));
    }

    @Override
    public SupplyExecutionOrderRS farmerConfirm(FarmerSupplyConfirmRQ rq, Long farmerUserId) {
        SupplyExecutionOrderEntity order = orderRepo.findById(rq.getOrderId()).orElseThrow();

        if (!rq.getAccepted()) {
            if (rq.getFarmerRemark() == null || rq.getFarmerRemark().isBlank())
                throw new RuntimeException("Rejection reason required");
            order.setStatus(SupplyStatus.FAILED);
            order.setSystemRemark(rq.getFarmerRemark());
            order.setRejectionReason(rq.getFarmerRemark());

            notificationService.notifyUser(order.getSupplierUserId(),
                    NotificationType.SUPPLY_REJECTED, "Delivery Rejected",
                    "Farmer rejected the delivery", order.getId());
            notificationService.notifyUser(
                    allocationService.getByAgreementId(order.getAgreement().getAgreementId()).getBuyerUserId(),
                    NotificationType.SUPPLY_FAILED, "Supply Failed",
                    "Farmer rejected supplier delivery", order.getId());

            return supplyMapper.mapEntityToRS(orderRepo.save(order));
        }

        if (order.getInvoice() == null)
            throw new RuntimeException("Supplier invoice not uploaded yet");
        if (rq.getDeliveryPhotoUrl() == null || rq.getBillPhotoUrl() == null || rq.getBillAmountEntered() == null)
            throw new RuntimeException("Delivery photo & bill details required");

        order.setActualDeliveryDate(rq.getActualDeliveryDate());
        order.setDeliveryPhotoUrl(rq.getDeliveryPhotoUrl());
        order.setFarmerBillPhotoUrl(rq.getBillPhotoUrl());
        order.setFarmerEnteredBillAmount(rq.getBillAmountEntered());

        double systemTotal = order.getInvoice().getTotalAmount();
        if (Math.abs(systemTotal - rq.getBillAmountEntered()) > 2.0)
            order.setSystemRemark("Farmer reported amount different from supplier invoice");

        order.setStatus(SupplyStatus.FARMER_CONFIRMED);
        order = orderRepo.saveAndFlush(order);

        notificationService.notifyUser(
                allocationService.getByAgreementId(order.getAgreement().getAgreementId()).getBuyerUserId(),
                NotificationType.FARMER_CONFIRMED_SUPPLY, "Farmer Confirmed Delivery",
                "Farmer confirmed delivery. Please verify.", order.getId());

        return supplyMapper.mapEntityToRS(order);
    }

    @Override
    public SupplyExecutionOrderRS buyerConfirm(Long orderId, Long buyerUserId) {
        SupplyExecutionOrderEntity order =
                orderRepo.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStage() != FarmingStage.FINAL)
            throw new RuntimeException("Buyer confirmation allowed only for FINAL stage");
        if (order.getStatus() != SupplyStatus.IN_TRANSIT)
            throw new RuntimeException("Harvest not dispatched yet");

        order.setStatus(SupplyStatus.BUYER_CONFIRMED);
        orderRepo.save(order);
        autoApproveAndRelease(order.getId());
        return supplyMapper.mapEntityToRS(order);
    }

    @Override
    public SupplyExecutionOrderRS farmerDispatch(FarmerDispatchRQ rq, Long farmerUserId) {
        SupplyExecutionOrderEntity order = orderRepo.findById(rq.getOrderId()).orElseThrow();

        if (order.getStage() != FarmingStage.FINAL)
            throw new RuntimeException("Dispatch proof only required for final stage");
        if (order.getStatus() != SupplyStatus.FARMER_CONFIRMED)
            throw new RuntimeException("Farmer must confirm materials first");

        if (order.getProofs() == null) {
            order.setProofs(new ArrayList<>());
        }
        order.getProofs().add(SupplyProof.builder()
                .order(order).type(ProofType.VEHICLE_NUMBER_AT_SOURCE)
                .metadata(rq.getVehicleNumber()).build());
        order.getProofs().add(SupplyProof.builder()
                .order(order).type(ProofType.FARM_LOADING_PHOTO)
                .fileUrl(rq.getLoadingPhotoUrl())
                .metadata(rq.getBagCount() == null ? null : rq.getBagCount().toString()).build());
        order.setStatus(SupplyStatus.IN_TRANSIT);
        orderRepo.save(order);

        Long buyerId = allocationService.getByAgreementId(order.getAgreement().getAgreementId()).getBuyerUserId();
        notificationService.notifyUser(buyerId, NotificationType.HARVEST_DISPATCHED,
                "Harvest Dispatched",
                "Farmer loaded harvest into vehicle " + rq.getVehicleNumber(), order.getId());

        return supplyMapper.mapEntityToRS(order);
    }

    @Override
    public void autoApproveAndRelease(Long orderId) {
        SupplyExecutionOrderEntity order = orderRepo.findById(orderId).orElseThrow();

        if (order.getEscrowStatus() == EscrowReleaseStatus.RELEASED) return;
        if (order.getStatus() != SupplyStatus.BUYER_CONFIRMED)
            throw new RuntimeException("Buyer confirmation pending");
        if (order.getInvoice() == null)
            throw new RuntimeException("Supplier invoice not uploaded");

        double calculatedTotal = order.getInvoice().getItems().stream()
                .mapToDouble(i -> i.getAmount()).sum();
        calculatedTotal += order.getInvoice().getDeliveryCharge() == null ? 0 : order.getInvoice().getDeliveryCharge();
        double invoiceTotal = order.getInvoice().getTotalAmount();

        if (Math.abs(calculatedTotal - invoiceTotal) > 1) {
            order.setStatus(SupplyStatus.DISPUTE);
            order.setSystemRemark("Invoice calculation mismatch");
            orderRepo.save(order);
            return;
        }

        if (order.getFarmerEnteredBillAmount() == null)
            throw new RuntimeException("Farmer verification missing");

        if (Math.abs(order.getFarmerEnteredBillAmount() - invoiceTotal) > 2.0) {
            order.setStatus(SupplyStatus.DISPUTE);
            order.setSystemRemark("Farmer and supplier amounts mismatch");
            orderRepo.save(order);
            Long buyerId = getBuyerUserId(order);
            notificationService.notifyUser(buyerId, NotificationType.SUPPLY_DISPUTE,
                    "Supply Amount Mismatch", "Farmer reported different amount than supplier invoice", order.getId());
            notificationService.notifyUser(order.getSupplierUserId(), NotificationType.SUPPLY_DISPUTE,
                    "Payment On Hold", "Amount mismatch — waiting for buyer resolution", order.getId());
            return;
        }

        if (invoiceTotal > order.getAllocatedAmount()) {
            order.setStatus(SupplyStatus.DISPUTE);
            order.setSystemRemark("Invoice exceeds stage allocation");
            orderRepo.save(order);
            return;
        }

        if (order.getActualDeliveryDate() != null && order.getExpectedDeliveryDate() != null
                && order.getActualDeliveryDate().isAfter(order.getExpectedDeliveryDate().plusDays(3)))
            order.setSystemRemark("Late delivery beyond tolerance");

        if (order.getStage() == FarmingStage.FINAL) {
            if (order.getProofs() == null || order.getProofs().isEmpty())
                throw new RuntimeException("Transport proof missing");
            boolean hasSource = order.getProofs().stream()
                    .anyMatch(p -> p.getType() == ProofType.VEHICLE_NUMBER_AT_SOURCE);
            boolean hasWarehouse = order.getProofs().stream()
                    .anyMatch(p -> p.getType() == ProofType.WAREHOUSE_UNLOADING_PHOTO);
            if (!hasSource || !hasWarehouse)
                throw new RuntimeException("Transport chain proof incomplete");
        }

        EscrowPurpose purpose = switch (order.getStage()) {
            case ADVANCE -> EscrowPurpose.SUPPLIER_ADVANCE;
            case MID     -> EscrowPurpose.SUPPLIER_MID;
            case FINAL   -> EscrowPurpose.SUPPLIER_FINAL;
        };

        escrowService.releaseToSupplier(
                order.getAgreement().getAgreementId(), getBuyerUserId(order),
                order.getSupplierUserId(), invoiceTotal, purpose,
                order.getStage() + "_SUPPLY_" + orderId);

        order.setEscrowStatus(EscrowReleaseStatus.RELEASED);
        order.setStatus(SupplyStatus.APPROVED);
        orderRepo.save(order);

        notificationService.notifyUser(order.getSupplierUserId(), NotificationType.SUPPLY_APPROVED,
                "Supply Approved", "Buyer approved delivery and payment released", order.getId());

        orderRepo.markAllStagesApproved(order.getAgreement().getAgreementId());
        agreementService.completeAgreement(order.getAgreement().getAgreementId());
    }


    private Long getBuyerUserId(SupplyExecutionOrderEntity order) {
        return allocationService.getByAgreementId(order.getAgreement().getAgreementId()).getBuyerUserId();
    }

    private double getAvailableEscrowByStage(AgreementEscrowAllocation alloc, FarmingStage stage) {
        return switch (stage) {
            case ADVANCE -> alloc.getAdvanceAllocated() - alloc.getAdvanceReleased();
            case MID     -> alloc.getMidAllocated()     - alloc.getMidReleased();
            case FINAL   -> alloc.getFinalAllocated()   - alloc.getFinalReleased();
        };
    }
}