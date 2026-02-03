package com.Farm360.dto.response.cultivation;

import com.Farm360.utils.CultivationUpdateType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationUpdateRS {

    private Long cultivationUpdateId;

    private Long cultivationExecutionId;

    private CultivationUpdateType updateType;

    /**
     * Farmer-provided remarks.
     */
    private String remarks;

    /**
     * Audit timestamp — authoritative ordering.
     */
    private LocalDateTime createdAt;
}
