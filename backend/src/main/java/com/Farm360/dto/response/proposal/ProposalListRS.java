package com.Farm360.dto.response.proposal;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalListRS {

    private Long proposalId;
    private Long requestId;

    private Integer latestVersion;

    private String counterPartyName;
    private String counterPartyRole;

    private String proposalStatus;
    private String actionRequiredBy;

    private LocalDateTime expiresOn;

    private Boolean locked;

    private LocalDateTime lastUpdatedAt;
}
