package com.Farm360.service.proposal;

import com.Farm360.dto.response.proposal.ProposalHistoryRS;
import com.Farm360.dto.response.proposal.ProposalListRS;
import com.Farm360.utils.Role;

import java.util.List;

public interface ProposalDashboardService {

    List<ProposalListRS> getMyProposals(Long userId, Role role);

    ProposalHistoryRS getProposalHistory(Long requestId, Long userId);
}
