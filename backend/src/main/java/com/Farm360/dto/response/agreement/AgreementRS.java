package com.Farm360.dto.response.agreement;

import com.Farm360.utils.AgreementStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgreementRS {

    private Long agreementId;

    private Long proposalId;
    private Integer proposalVersion;
    private Long requestId;

    private Long farmerUserId;
    private Long buyerUserId;

    private AgreementStatus status;

    private LocalDateTime signedAt;
    private LocalDateTime completedAt;
    private LocalDateTime terminatedAt;

    private String agreementSnapshot;
}
