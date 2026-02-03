package com.Farm360.dto.request.cultivation;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationConcernCreateRQ {

    @NotNull
    private Long cultivationExecutionId;

    @NotNull
    private Long buyerId;

    /**
     * Buyer explanation.
     * Mandatory and audit-critical.
     */
    @NotNull
    private String description;
}
