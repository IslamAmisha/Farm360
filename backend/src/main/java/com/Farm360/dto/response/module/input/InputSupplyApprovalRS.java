package com.Farm360.dto.response.module.input;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyApprovalRS {

    private Long approvalId;

    private Boolean approved;

    private String reason;

    private LocalDateTime actedAt;
}

