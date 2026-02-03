package com.Farm360.dto.request.cultivation;

import com.Farm360.utils.CultivationFeedbackType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationFeedbackCreateRQ {

    @NotNull
    private Long cultivationExecutionId;

    @NotNull
    private Long buyerId;

    /**
     * COMMENT / APPROVAL / QUALITY_CONCERN
     * Observational by default.
     */
    @NotNull
    private CultivationFeedbackType feedbackType;

    /**
     * Buyer message.
     * Mandatory for COMMENT and QUALITY_CONCERN.
     */
    private String remarks;
}
