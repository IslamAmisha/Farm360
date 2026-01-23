package com.Farm360.repository.proposal;



import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.utils.ProposalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    List<ProposalEntity> findByProposalStatusInAndActionDueAtBefore(List<ProposalStatus> statuses, LocalDateTime now);


    //For Proposal List (all proposals of user)
    @Query("""
        SELECT p FROM ProposalEntity p
        WHERE p.senderUserId = :userId
           OR p.receiverUserId = :userId
    """)
    List<ProposalEntity> findAllByUser(@Param("userId") Long userId);


    // For grouping by request (history root)
    List<ProposalEntity> findByRequestIdOrderByProposalVersionAsc(Long requestId);



    //Get latest proposal per request (used internally)
    @Query("""
        SELECT p FROM ProposalEntity p
        WHERE p.requestId = :requestId
        ORDER BY p.proposalVersion DESC
    """)
    List<ProposalEntity> findLatestByRequestId(@Param("requestId") Long requestId);
}
