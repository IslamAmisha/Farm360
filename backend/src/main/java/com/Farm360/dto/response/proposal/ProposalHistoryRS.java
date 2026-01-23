package com.Farm360.dto.response.proposal;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalHistoryRS {

    private Long requestId;
    private Long rootProposalId;

    private String finalStatus;

    private List<ProposalVersionHistoryRS> versions;
}
