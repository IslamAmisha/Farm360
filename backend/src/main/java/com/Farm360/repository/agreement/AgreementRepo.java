package com.Farm360.repository.agreement;

import com.Farm360.model.agreement.AgreementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgreementRepo extends JpaRepository<AgreementEntity,Long> {
    boolean existsByProposalId(Long proposalId);

    List<AgreementEntity> findByFarmerUserIdOrBuyerUserId(Long userId, Long userId1);
}
