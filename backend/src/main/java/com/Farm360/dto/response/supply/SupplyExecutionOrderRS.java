package com.Farm360.dto.response.supply;

import com.Farm360.dto.response.supply.SupplyExecutionItemRS;
import com.Farm360.dto.response.supply.SupplyProofRS;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplyExecutionOrderRS {

    private Long    orderId;
    private Long    agreementId;
    private String  stage;
    private String  status;
    private String  supplierType;
    private Long    supplierUserId;
    private Double  allocatedAmount;
    private Double  billAmount;
    private Double  payableAmount;
    private String  escrowStatus;

    private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;

    private String  systemRemark;
    private String  rejectionReason;
    private String  deliveryPhotoUrl;
    private String  vehicleNumber;
    private String  invoiceNumber;
    private String  invoicePhotoUrl;


    private String  farmerName;
    private String  buyerName;
    private String  cropName;
    private String  deliveryLocation;

    private List<SupplyExecutionItemRS> items;
    private List<SupplyProofRS>         proofs;
}