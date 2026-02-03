package com.Farm360.dto.request.cultivation;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationExecutionCreateRQ {

    @NotNull
    private Long agreementId;

    @NotNull
    private Long farmerId;

    @NotNull
    private Long buyerId;

    /**
     * Expected cultivation start date.
     * Informational — not enforced as a deadline.
     */
    @NotNull
    private LocalDate cultivationStartDate;

    /**
     * Expected harvest window start.
     * Used for visibility, not obligation enforcement.
     */
    @NotNull
    private LocalDate expectedHarvestStartDate;

    /**
     * Expected harvest window end.
     */
    @NotNull
    private LocalDate expectedHarvestEndDate;
}
