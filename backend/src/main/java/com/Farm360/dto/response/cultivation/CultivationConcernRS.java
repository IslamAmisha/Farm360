package com.Farm360.dto.response.cultivation;

import com.Farm360.utils.CultivationConcernStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationConcernRS {

    private Long cultivationConcernId;

    private Long cultivationExecutionId;

    private Long buyerId;



    private String description;

    /**
     * OPEN / RESPONDED / RESOLVED / ESCALATED
     */
    private CultivationConcernStatus status;

    private LocalDateTime raisedAt;

    private LocalDateTime escalatedAt;

    private LocalDateTime resolvedAt;

}
