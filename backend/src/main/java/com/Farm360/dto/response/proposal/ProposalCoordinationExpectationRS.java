package com.Farm360.dto.response.proposal;

import com.Farm360.utils.CoordinationSubject;
import com.Farm360.utils.CoordinationType;
import com.Farm360.utils.Role;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalCoordinationExpectationRS {

    private Long id;

    private CoordinationSubject subject;

    private CoordinationType coordinationType;

    private Role actionRequiredBy;

    /**
     * Calculated expected date for front-end
     */
    private LocalDate expectedBy;

    private String note;

    private Integer proposalVersion;
}
