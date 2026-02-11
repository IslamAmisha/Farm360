package com.Farm360.service.supply;

import com.Farm360.dto.request.supply.FarmerSupplyConfirmRQ;
import com.Farm360.dto.request.supply.SupplierBillUploadRQ;
import com.Farm360.dto.request.supply.SupplyExecutionCreateRQ;
import com.Farm360.dto.response.supply.SupplyExecutionOrderRS;
import com.Farm360.mapper.supply.SupplyExecutionOrderMapper;
import com.Farm360.model.SupplierEntity;
import com.Farm360.model.master.items.SupplyItemName;
import com.Farm360.model.payment.AgreementEscrowAllocation;
import com.Farm360.model.supply.SupplyExecutionItemEntity;
import com.Farm360.model.supply.SupplyExecutionOrderEntity;
import com.Farm360.repository.master.items.SupplyItemNameRepository;
import com.Farm360.repository.supplier.SupplierRepo;
import com.Farm360.repository.supply.SupplyExecutionItemRepository;
import com.Farm360.repository.supply.SupplyExecutionOrderRepository;
import com.Farm360.service.agreement.AgreementEscrowAllocationService;
import com.Farm360.service.agreement.AgreementService;
import com.Farm360.service.escrow.EscrowService;
import com.Farm360.utils.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class  SupplyExecutionServiceImpl implements SupplyExecutionService {

    @Autowired
    private SupplyExecutionOrderRepository orderRepo;
    @Autowired
    private SupplyExecutionItemRepository itemRepo;
    @Autowired
    private AgreementEscrowAllocationService allocationService;
    @Autowired
    private EscrowService escrowService;
    @Autowired
    private SupplierRepo supplierRepo;
    @Autowired
    private SupplyExecutionOrderMapper SupplyExecutionOrderMapper;

    @Autowired
    private AgreementService agreementService;

    @Autowired
    private SupplyItemNameRepository itemNameRepo;

    @Override
    public  SupplyExecutionOrderRS createAdvanceSupply(
             SupplyExecutionCreateRQ rq,
            Long userId
    ) {
        //Validate agreement + stage
        AgreementEscrowAllocation alloc =
                allocationService.getByAgreementId(rq.getAgreementId());

        double availableAmount =
                getAvailableEscrowByStage(alloc, rq.getStage());

        if (rq.getDemandAmount() == null || rq.getDemandAmount() <= 0)
            throw new RuntimeException("Demand amount is required");

        if (rq.getDemandAmount() > availableAmount)
            throw new RuntimeException(
                    "Demand amount exceeds available escrow for " + rq.getStage()
            );

        if (availableAmount <= 0)
            throw new RuntimeException("Escrow exhausted for " + rq.getStage());

        //Resolve supplier (primary or fallback)
        SupplierEntity supplier =
                supplierRepo.findFirstBySupplierTypeAndVerificationStatus(
                        rq.getSupplierType(), VerificationStatus.VERIFIED
                ).orElseThrow(() -> new RuntimeException("No verified supplier"));

        // Create order
         SupplyExecutionOrderEntity order =
                 SupplyExecutionOrderEntity.builder()
                        .agreementId(rq.getAgreementId())
                        .proposalVersion(rq.getProposalVersion())
                        .stage(rq.getStage())
                        .supplierUserId(supplier.getUser().getId())
                        .supplierType(rq.getSupplierType())
                        .allocatedAmount(rq.getDemandAmount())
                        .status(SupplyStatus.SUPPLIER_NOTIFIED)
                        .escrowStatus(EscrowReleaseStatus.HELD)
                        .expectedDeliveryDate(rq.getExpectedDeliveryDate())
                        .build();

        orderRepo.save(order);

        // Items
        rq.getItems().forEach(i -> {

            // If user selected OTHER → auto add to dropdown table
            if (i.getType() == SupplyItemType.OTHER
                    && i.getProductName() != null
                    && !i.getProductName().isBlank()) {

                boolean exists = itemNameRepo
                        .existsBySupplierTypeAndNameIgnoreCase(
                                rq.getSupplierType(),
                                i.getProductName()
                        );

                if (!exists) {
                    itemNameRepo.save(
                            SupplyItemName.builder()
                                    .supplierType(rq.getSupplierType())
                                    .name(i.getProductName())
                                    .active(true)
                                    .build()
                    );
                }
            }

            itemRepo.save(
                     SupplyExecutionItemEntity.builder()
                            .order(order)
                            .type(i.getType())
                            .brandName(i.getBrandName())
                            .productName(i.getProductName())
                            .quantity(i.getQuantity())
                            .unit(i.getUnit())
                            .expectedPrice(i.getExpectedPrice())
                            .build()
            );
        });

        return  SupplyExecutionOrderMapper.mapEntityToRS(order);
    }

    @Override
    public SupplyExecutionOrderRS uploadSupplierBill(
            SupplierBillUploadRQ rq,
            Long supplierUserId
    ) {
         SupplyExecutionOrderEntity order =
                orderRepo.findById(rq.getOrderId()).orElseThrow();

        if (!order.getSupplierUserId().equals(supplierUserId))
            throw new RuntimeException("Unauthorized supplier");

        order.setBillAmount(rq.getBillAmount());
        order.setPayableAmount(rq.getBillAmount());
        order.setStatus(SupplyStatus.DISPATCHED);

        return  SupplyExecutionOrderMapper.mapEntityToRS(orderRepo.save(order));
    }

    @Override
    public  SupplyExecutionOrderRS farmerConfirm(
            FarmerSupplyConfirmRQ rq,
            Long farmerUserId
    ) {
         SupplyExecutionOrderEntity order =
                orderRepo.findById(rq.getOrderId()).orElseThrow();

        if (!rq.getAccepted()) {
            order.setStatus(SupplyStatus.FAILED);
            order.setSystemRemark(rq.getFarmerRemark());
            return  SupplyExecutionOrderMapper.mapEntityToRS(orderRepo.save(order));
        }

        order.setActualDeliveryDate(rq.getActualDeliveryDate());
        order.setStatus(SupplyStatus.FARMER_CONFIRMED);

        orderRepo.save(order);

        return  SupplyExecutionOrderMapper.mapEntityToRS(order);
    }

    @Override
    public void autoApproveAndRelease(Long orderId) {

         SupplyExecutionOrderEntity order =
                orderRepo.findById(orderId).orElseThrow();

        if (order.getStatus() != SupplyStatus.BUYER_CONFIRMED)
            throw new RuntimeException("Buyer confirmation pending");

        if (order.getBillAmount() == null)
            throw new RuntimeException("Supplier bill not uploaded");

        if (order.getBillAmount() <= order.getAllocatedAmount()) {

            EscrowPurpose purpose =
                    switch (order.getStage()) {
                        case ADVANCE -> EscrowPurpose.SUPPLIER_ADVANCE;
                        case MID -> EscrowPurpose.SUPPLIER_MID;
                        case FINAL -> EscrowPurpose.SUPPLIER_FINAL;
                    };

            escrowService.releaseToSupplier(
                    order.getAgreementId(),
                    getBuyerUserId(order),
                    order.getSupplierUserId(),
                    order.getBillAmount(),
                    purpose,
                    order.getStage() + "_SUPPLY_" + orderId
            );

            order.setEscrowStatus(EscrowReleaseStatus.RELEASED);
            order.setStatus(SupplyStatus.APPROVED);

            agreementService.completeAgreement(order.getAgreementId());

        } else {
            order.setSystemRemark("Bill exceeds allocation. Buyer refill needed.");
        }

        orderRepo.save(order);
    }

    @Override
    public  SupplyExecutionOrderRS supplierAccept(Long orderId, Long supplierUserId) {

         SupplyExecutionOrderEntity order =
                orderRepo.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getSupplierUserId().equals(supplierUserId))
            throw new RuntimeException("Unauthorized supplier");

        if (order.getStatus() != SupplyStatus.SUPPLIER_NOTIFIED)
            throw new RuntimeException("Order cannot be accepted in this state");

        order.setStatus(SupplyStatus.SUPPLIER_ACCEPTED);

        return  SupplyExecutionOrderMapper.mapEntityToRS(orderRepo.save(order));
    }


    private Long getBuyerUserId( SupplyExecutionOrderEntity order) {

        AgreementEscrowAllocation allocation =
                allocationService.getByAgreementId(order.getAgreementId());

        return allocation.getBuyerUserId();
    }

    private double getAvailableEscrowByStage(
            AgreementEscrowAllocation alloc,
            FarmingStage stage
    ) {
        return switch (stage) {
            case ADVANCE ->
                    alloc.getAdvanceAllocated() - alloc.getAdvanceReleased();
            case MID ->
                    alloc.getMidAllocated() - alloc.getMidReleased();
            case FINAL ->
                    alloc.getFinalAllocated() - alloc.getFinalReleased();
        };
    }

    @Override
    public  SupplyExecutionOrderRS buyerConfirm(Long orderId, Long buyerUserId) {

         SupplyExecutionOrderEntity order =
                orderRepo.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStage() != FarmingStage.FINAL) {
            throw new RuntimeException("Buyer confirmation allowed only for FINAL stage");
        }

        if (order.getStatus() != SupplyStatus.FARMER_CONFIRMED)
            throw new RuntimeException("Farmer confirmation pending");

        order.setStatus(SupplyStatus.BUYER_CONFIRMED);
        orderRepo.save(order);

        // Now system auto validates
        autoApproveAndRelease(order.getId());

        return  SupplyExecutionOrderMapper.mapEntityToRS(order);
    }
}
