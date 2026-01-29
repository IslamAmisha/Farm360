package com.Farm360.repository.proposal;

import com.Farm360.model.proposal.ProposalCoordinationExpectationEntity;
import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.utils.CoordinationSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProposalCoordinationExpectationRepository
        extends JpaRepository<ProposalCoordinationExpectationEntity, Long> {

    Optional<ProposalCoordinationExpectationEntity>
    findByProposalAndSubjectAndActiveTrue(
            ProposalEntity proposal,
            CoordinationSubject subject
    );

    List<ProposalCoordinationExpectationEntity>
    findByProposal(ProposalEntity proposal);
}
