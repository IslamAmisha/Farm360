package com.Farm360.mapper.agreement;

import com.Farm360.dto.response.agreement.AgreementResponseDTO;
import com.Farm360.dto.response.agreement.AgreementSummaryDTO;
import com.Farm360.model.agreement.AgreementEntity;

public class AgreementMapper {

    private AgreementMapper() {
        // utility class
    }

    // ===============================
    // Entity → Full Response
    // ===============================
    public static AgreementResponseDTO toResponse(AgreementEntity agreement) {
        if (agreement == null) return null;

        return AgreementResponseDTO.builder()
                .agreementId(agreement.getId())
                .proposalId(agreement.getProposalId())
                .requestId(agreement.getRequestId())
                .buyerId(agreement.getBuyerId())
                .farmerId(agreement.getFarmerId())
                .totalContractAmount(agreement.getTotalContractAmount())

                .status(agreement.getStatus())
                .startDate(agreement.getStartDate())
                .endDate(agreement.getEndDate())
                .build();
    }

    // ===============================
    // Entity → Summary (list views)
    // ===============================
    public static AgreementSummaryDTO toSummary(
            AgreementEntity agreement,
            Long counterpartyId
    ) {
        if (agreement == null) return null;

        return AgreementSummaryDTO.builder()
                .agreementId(agreement.getId())
                .proposalId(agreement.getProposalId())
                .counterpartyId(counterpartyId)
                .totalContractAmount(agreement.getTotalContractAmount())
                .status(agreement.getStatus())
                .build();
    }
}
