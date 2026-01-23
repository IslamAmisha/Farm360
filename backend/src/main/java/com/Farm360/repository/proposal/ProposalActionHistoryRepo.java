package com.Farm360.repository.proposal;

import com.Farm360.model.proposal.ProposalActionHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalActionHistoryRepo extends JpaRepository<ProposalActionHistoryEntity, Long> {

    // All actions for a proposal version
    List<ProposalActionHistoryEntity> findByProposalIdOrderByActionAtAsc(Long proposalId);

    // All actions for a request
    List<ProposalActionHistoryEntity>
    findByProposalVersionOrderByActionAtAsc(Integer proposalVersion);
}
