package com.Farm360.dto.request.cultivation;

import com.Farm360.utils.CultivationUpdateType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationUpdateCreateRQ {

    @NotNull
    private Long cultivationExecutionId;


    @NotNull
    private CultivationUpdateType updateType;

    /**
     * Free-form farmer note.
     * Not interpreted by system logic.
     */
    private String remarks;
}

