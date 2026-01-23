package com.Farm360.dto.response.proposal;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalVersionHistoryRS {

    private Long proposalId;
    private Integer proposalVersion;

    private String createdByRole;
    private String proposalStatus;

    private ProposalRS proposalData;

    private List<ProposalActionRS> actions;
}
