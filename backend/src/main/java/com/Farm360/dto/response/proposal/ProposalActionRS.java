package com.Farm360.dto.response.proposal;


import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalActionRS {

    private String actionType;
    private String actionBy;
    private LocalDateTime actionAt;
    private String remarks;
}
