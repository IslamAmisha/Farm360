package com.Farm360.repository.agreement;

import com.Farm360.model.agreement.AgreementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgreementRepo extends JpaRepository<AgreementEntity,Long> {
    boolean existsByProposalId(Long proposalId);

    List<AgreementEntity> findByFarmerUserIdOrBuyerUserId(Long userId, Long userId1);

    Optional<AgreementEntity> findByProposalId(Long proposalId);

    List<AgreementEntity> findByFarmerUserId(Long farmerUserId);
    List<AgreementEntity> findByBuyerUserId(Long buyerUserId);

    @Query("SELECT a FROM AgreementEntity a " +
            "WHERE (a.farmerUserId = :userId OR a.buyerUserId = :userId) " +
            "AND a.status NOT IN ('COMPLETED', 'CANCELLED', 'REJECTED')")
    List<AgreementEntity> findActiveByUserId(@Param("userId") Long userId);
}
