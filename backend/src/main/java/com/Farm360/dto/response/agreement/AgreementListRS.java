package com.Farm360.dto.response.agreement;

import com.Farm360.utils.AgreementStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgreementListRS {

    private Long agreementId;

    private Long proposalId;
    private Long requestId;

    private AgreementStatus status;

    private String counterPartyName;
    private String counterPartyRole;

    private LocalDateTime signedAt;
}
