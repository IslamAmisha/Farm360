package com.Farm360.dto.request.module.input;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyOrderCreateRQ {

    private Long agreementId;

    private Double totalAmount;

    private List<InputSupplyItemCreateRQ> items;
}

