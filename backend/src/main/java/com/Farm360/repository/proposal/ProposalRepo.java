package com.Farm360.repository.proposal;



import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.utils.ProposalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProposalRepo extends JpaRepository<ProposalEntity, Long> {

    // Get all proposals by request
    List<ProposalEntity> findByRequestId(Long requestId);

    // Get proposals sent to a specific receiver
    List<ProposalEntity> findByReceiverUserIdAndProposalStatus(Long receiverUserId, ProposalStatus status);

    // Get all proposals created by a sender
    List<ProposalEntity> findBySenderUserId(Long senderUserId);

    // Optional: find by request + accepted status
    List<ProposalEntity> findByRequestIdAndProposalStatus(Long requestId, ProposalStatus status);
}
