package com.Farm360.dto.request.module.input;

import com.Farm360.utils.InputType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyItemCreateRQ {

    private InputType inputType;   // SEED / FERTILIZER / CHEMICAL / PESTICIDE

    private String brandName;
    private String productName;

    private Double quantity;
    private String unit;

    private Double expectedPrice;
}
