package com.Farm360.dto.response.module.input;

import com.Farm360.utils.InputType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyItemRS {

    private Long id;

    private InputType inputType;

    private String brandName;
    private String productName;

    private Double quantity;
    private String unit;

    private Double expectedPrice;
}

