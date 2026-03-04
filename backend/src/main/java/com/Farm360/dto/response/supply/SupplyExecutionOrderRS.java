package com.Farm360.dto.response.supply;

import com.Farm360.utils.EscrowReleaseStatus;
import com.Farm360.utils.FarmingStage;
import com.Farm360.utils.SupplierType;
import com.Farm360.utils.SupplyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplyExecutionOrderRS {

    private Long orderId;
    private Long agreementId;

    private String buyerName;
    private String farmerName;
    private String cropName;
    private String deliveryLocation;

    private FarmingStage stage;

    private SupplierType supplierType;
    private SupplyStatus status;
    private EscrowReleaseStatus escrowStatus;

    private Double allocatedAmount;
    private Double billAmount;
    private Double payableAmount;

    private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;

    private List<SupplyExecutionItemRS> items;
}
