package com.Farm360.dto.response.agreement;

import com.Farm360.utils.AgreementStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AgreementSummaryDTO {

    private Long agreementId;
    private Long proposalId;

    private Long counterpartyId; // buyer sees farmer, farmer sees buyer

    private BigDecimal totalContractAmount;
    private AgreementStatus status;
}
