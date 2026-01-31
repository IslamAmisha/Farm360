package com.Farm360.dto.response.module.input;

import com.Farm360.utils.InputEscrowStatus;
import com.Farm360.utils.InputSupplyStage;
import com.Farm360.utils.InputSupplyStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyOrderRS {

    private Long orderId;

    private Long agreementId;
    private Integer proposalVersion;

    private InputSupplyStage stage;
    private InputSupplyStatus status;
    private InputEscrowStatus escrowStatus;

    private Double totalAmount;

    private Integer attemptCount;

    private LocalDateTime uploadDueAt;
    private LocalDateTime approvalDueAt;

    private String systemRemark;

    private List<InputSupplyItemRS> items;
    private List<InputSupplyProofRS> proofs;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

