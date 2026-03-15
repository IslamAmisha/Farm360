package com.Farm360.mapper.supply;

import com.Farm360.dto.response.supply.*;
import com.Farm360.model.supply.SupplyExecutionOrderEntity;
import com.Farm360.repository.buyer.BuyerRepo;
import com.Farm360.repository.farmer.FarmerRepo;
import com.Farm360.repository.master.CropRepo;
import com.Farm360.utils.ProofType;
import com.Farm360.utils.SupplyStatus;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SupplyExecutionOrderMapper {

    @Autowired private SupplyExecutionItemMapper itemMapper;
    @Autowired private FarmerRepo farmerRepo;
    @Autowired private BuyerRepo buyerRepo;
    @Autowired private CropRepo cropRepo;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public SupplyExecutionOrderRS mapEntityToRS(SupplyExecutionOrderEntity order) {

        SupplyExecutionOrderRS rs = new SupplyExecutionOrderRS();

        // ── Basic order fields (unchanged) ───────────────────────────
        rs.setOrderId(order.getId());
        rs.setAgreementId(order.getAgreement() != null ? order.getAgreement().getAgreementId() : null);
        rs.setStage(order.getStage() != null ? order.getStage().name() : null);
        rs.setStatus(order.getStatus() != null ? order.getStatus().name() : null);
        rs.setSupplierType(order.getSupplierType() != null ? order.getSupplierType().name() : null);
        rs.setSupplierUserId(order.getSupplierUserId());
        rs.setAllocatedAmount(order.getAllocatedAmount());
        rs.setBillAmount(order.getBillAmount());
        rs.setPayableAmount(order.getPayableAmount());
        rs.setEscrowStatus(order.getEscrowStatus() != null ? order.getEscrowStatus().name() : null);
        rs.setExpectedDeliveryDate(order.getExpectedDeliveryDate());
        rs.setActualDeliveryDate(order.getActualDeliveryDate());
        rs.setSystemRemark(order.getSystemRemark());
        rs.setRejectionReason(order.getRejectionReason());
        rs.setDeliveryPhotoUrl(order.getDeliveryPhotoUrl());

        // ── NEW: tolerance range + delivery address ───────────────────
        rs.setMinBillAmount(order.getMinBillAmount());
        rs.setMaxBillAmount(order.getMaxBillAmount());
        rs.setDeliveryAddress(order.getDeliveryAddress());

        // ── Proofs (unchanged) ────────────────────────────────────────
        if (order.getProofs() != null) {
            order.getProofs().stream()
                    .filter(p -> p.getType() == ProofType.VEHICLE_NUMBER_AT_SOURCE)
                    .findFirst()
                    .ifPresent(p -> rs.setVehicleNumber(p.getMetadata()));

            rs.setProofs(order.getProofs().stream()
                    .map(p -> SupplyProofRS.builder()
                            .type(p.getType() != null ? p.getType().name() : null)
                            .fileUrl(p.getFileUrl())
                            .metadata(p.getMetadata())
                            .build())
                    .toList());
        }

        // ── Items (unchanged) ─────────────────────────────────────────
        if (order.getItems() != null) {
            rs.setItems(order.getItems().stream()
                    .map(itemMapper::mapEntityToRS)
                    .toList());
        }

        // ── NEW: full invoice object (replaces flat invoiceNumber/photoUrl) ──
        if (order.getInvoice() != null) {
            var inv = order.getInvoice();

            List<SupplierInvoiceItemRS> invItems = inv.getItems() == null ? List.of() :
                    inv.getItems().stream()
                            .map(i -> SupplierInvoiceItemRS.builder()
                                    .description(i.getDescription())
                                    .quantity(i.getQuantity())
                                    .rate(i.getRate())
                                    .amount(i.getAmount())
                                    .unit(i.getUnit())
                                    .build())
                            .toList();

            rs.setInvoice(SupplierInvoiceRS.builder()
                    .invoiceNumber(inv.getInvoiceNumber())
                    .deliveryCharge(inv.getDeliveryCharge())
                    .totalAmount(inv.getTotalAmount())
                    .invoicePhotoUrl(inv.getInvoicePhotoUrl())
                    .items(invItems)
                    .build());

            // Keep flat fields for backward compat with existing frontend
            rs.setInvoiceNumber(inv.getInvoiceNumber());
            rs.setInvoicePhotoUrl(inv.getInvoicePhotoUrl());
        }

        // ── Snapshot parse — names + buyer warehouse (privacy-gated) ──
        // Buyer warehouse address and phone are ONLY shown after the supplier
        // has accepted the order (status != SUPPLIER_NOTIFIED).
        // Before acceptance, any supplier in the broadcast can see the order,
        // so we must not leak the buyer's private contact details.
        boolean isAccepted = order.getStatus() != null
                && order.getStatus() != SupplyStatus.SUPPLIER_NOTIFIED;

        try {
            if (order.getAgreement() != null
                    && order.getAgreement().getAgreementSnapshot() != null) {

                JsonNode snap = objectMapper.readTree(
                        order.getAgreement().getAgreementSnapshot());

                // farmerName — snapshot first, then DB fallback (unchanged)
                String farmerName = snap.path("farmerName").asText("");
                if (farmerName.isBlank() || farmerName.equals("—")) {
                    long farmerUserId = snap.path("farmerUserId").asLong(0);
                    if (farmerUserId > 0) {
                        farmerName = farmerRepo.findByUserId(farmerUserId)
                                .map(f -> f.getFarmerName() != null
                                        ? f.getFarmerName() : "Farmer #" + farmerUserId)
                                .orElse("Farmer #" + farmerUserId);
                    }
                }
                rs.setFarmerName(farmerName.isBlank() ? "—" : farmerName);

                // buyerName — snapshot first, then DB fallback (unchanged)
                String buyerName = snap.path("buyerName").asText("");
                if (buyerName.isBlank() || buyerName.equals("—")) {
                    long buyerUserId = snap.path("buyerUserId").asLong(0);
                    if (buyerUserId > 0) {
                        buyerName = buyerRepo.findByUserId(buyerUserId)
                                .map(b -> b.getFullName() != null
                                        ? b.getFullName() : "Buyer #" + buyerUserId)
                                .orElse("Buyer #" + buyerUserId);
                    }
                }
                rs.setBuyerName(buyerName.isBlank() ? "—" : buyerName);

                // deliveryLocation (unchanged)
                rs.setDeliveryLocation(snap.path("deliveryLocation").asText("—"));

                // cropName — snapshot first, then DB fallback (unchanged)
                JsonNode crops = snap.path("crops");
                if (crops.isArray() && crops.size() > 0) {
                    String cropName = crops.get(0).path("cropName").asText("");
                    if (cropName.isBlank() || cropName.equals("—")) {
                        long cropId = crops.get(0).path("cropId").asLong(0);
                        if (cropId > 0) {
                            cropName = cropRepo.findById(cropId)
                                    .map(c -> c.getName())
                                    .orElse("Crop #" + cropId);
                        }
                    }
                    rs.setCropName(cropName.isBlank() ? "—" : cropName);
                }

                // ── NEW: buyer warehouse + phone — only after acceptance ──
                if (isAccepted) {
                    String warehouseAddress = snap.path("buyerWarehouseAddress").asText("");
                    String phone            = snap.path("buyerPhone").asText("");
                    rs.setBuyerWarehouseAddress(warehouseAddress.isBlank() || warehouseAddress.equals("—")
                            ? null : warehouseAddress);
                    rs.setBuyerPhone(phone.isBlank() || phone.equals("—")
                            ? null : phone);
                }
                // if not accepted, buyerWarehouseAddress and buyerPhone stay null
            }
        } catch (Exception e) {
            System.out.println("SNAPSHOT PARSE ERROR: " + e.getMessage());
        }

        return rs;
    }
}