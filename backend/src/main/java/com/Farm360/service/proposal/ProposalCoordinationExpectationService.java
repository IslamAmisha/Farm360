package com.Farm360.service.proposal;

import com.Farm360.dto.request.proposal.ProposalCoordinationExpectationRQ;
import com.Farm360.dto.response.proposal.ProposalCoordinationExpectationRS;
import com.Farm360.utils.Role;

import java.util.List;

public interface ProposalCoordinationExpectationService {

    /**
     * Create or counter a coordination expectation
     * (buyer or farmer depending on actionRequiredBy)
     */
    public ProposalCoordinationExpectationRS upsertExpectation(
            Long proposalId,
            ProposalCoordinationExpectationRQ rq,
            Long actingUserId,
            Role actingRole
    );

    /**
     * List all coordination expectations
     * (active + inactive history if needed)
     */
    List<ProposalCoordinationExpectationRS> getExpectations(
            Long proposalId
    );

    public List<ProposalCoordinationExpectationRS> getAllForProposal(
            Long proposalId
    );
}
