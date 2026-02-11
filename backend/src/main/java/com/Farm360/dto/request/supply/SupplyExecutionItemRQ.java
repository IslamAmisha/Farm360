package com.Farm360.dto.request.supply;

import com.Farm360.utils.SupplyItemType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplyExecutionItemRQ {

    private SupplyItemType type;

    private String brandName;
    private String productName;
    private Double quantity;
    private String unit;

    private Double expectedPrice;
}