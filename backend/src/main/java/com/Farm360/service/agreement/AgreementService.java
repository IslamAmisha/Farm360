package com.Farm360.service.agreement;

import com.Farm360.dto.response.agreement.AgreementResponseDTO;
import com.Farm360.dto.response.agreement.AgreementSummaryDTO;

import java.util.List;

public interface AgreementService {

    AgreementResponseDTO createAgreementFromProposal(Long proposalId);

    AgreementResponseDTO getByProposalId(Long proposalId);

    List<AgreementSummaryDTO> getByBuyerId(Long buyerId);

    List<AgreementSummaryDTO> getByFarmerId(Long farmerId);

    AgreementResponseDTO terminateAgreement(Long agreementId);
}
