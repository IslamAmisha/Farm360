package com.Farm360.dto.request.module.input;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyApprovalRQ {

    private Long orderId;

    private Boolean approved;

    private String reason; // mandatory if rejected
}
