package com.Farm360.dto.response.cultivation;

import com.Farm360.utils.CultivationStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationExecutionRS {

    private Long cultivationExecutionId;

    private Long agreementId;
    private Long farmerId;
    private Long buyerId;

    private LocalDate cultivationStartDate;
    private LocalDate expectedHarvestStartDate;
    private LocalDate expectedHarvestEndDate;

    /**
     * High-level execution state.
     * No financial or dispute implication by itself.
     */
    private CultivationStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime lastUpdatedAt;
}
