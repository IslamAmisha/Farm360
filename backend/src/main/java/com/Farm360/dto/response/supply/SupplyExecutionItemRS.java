package com.Farm360.dto.response.supply;

import com.Farm360.utils.SupplyItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplyExecutionItemRS {

    private Long itemId;

    private SupplyItemType type;

    private String brandName;
    private String productName;

    private Double quantity;
    private String unit;

    private Double expectedPrice;

    private Double billedPrice;
}