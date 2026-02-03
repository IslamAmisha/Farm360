package com.Farm360.dto.response.module.cultivation;

import com.Farm360.utils.CultivationFeedbackType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationFeedbackRS {

    private Long cultivationFeedbackId;

    private Long cultivationExecutionId;

    private Long buyerId;

    private CultivationFeedbackType feedbackType;

    /**
     * Buyer remarks or approval note.
     */
    private String remarks;

    /**
     * Audit timestamp.
     */
    private LocalDateTime createdAt;
}
