package com.Farm360.dto.request.supply;

import com.Farm360.utils.FarmingStage;
import com.Farm360.utils.Role;
import com.Farm360.utils.SupplierType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplyExecutionCreateRQ {

    private Long agreementId;
    private Integer proposalVersion;

    private SupplierType supplierType;

    private Role initiatedBy;

    private List< SupplyExecutionItemRQ> items;

    private FarmingStage stage;

    private Double demandAmount;

    private LocalDate expectedDeliveryDate;
}
