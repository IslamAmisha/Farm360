package com.Farm360.dto.response.agreement;

import com.Farm360.utils.AgreementStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AgreementResponseDTO {

    private Long agreementId;

    private Long proposalId;
    private Long requestId;

    private Long buyerId;
    private Long farmerId;

    private BigDecimal totalContractAmount;

    private AgreementStatus status;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
