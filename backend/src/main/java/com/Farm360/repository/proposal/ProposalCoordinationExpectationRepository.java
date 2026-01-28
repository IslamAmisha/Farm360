package com.Farm360.repository.proposal;

import com.Farm360.model.proposal.ProposalCoordinationExpectationEntity;
import com.Farm360.utils.CoordinationSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalCoordinationExpectationRepository
        extends JpaRepository<ProposalCoordinationExpectationEntity, Long> {

    /**
     * Fetch all ACTIVE coordination expectations
     * for the latest proposal snapshot
     */
    List<ProposalCoordinationExpectationEntity>
    findByProposalProposalIdAndActiveTrue(Long proposalId);

    /**
     * Fetch coordination expectations for a specific proposal version
     * (used for history / audit / agreement generation)
     */
    List<ProposalCoordinationExpectationEntity>
    findByProposalProposalIdAndProposalVersion(
            Long proposalId,
            Integer proposalVersion
    );


    /**
     * Fetch ACTIVE expectation for a given subject
     * (useful when countering / replacing expectations)
     */
    List<ProposalCoordinationExpectationEntity>
    findByProposalProposalIdAndSubjectAndActiveTrue(
            Long proposalId,
            CoordinationSubject subject
    );
}
