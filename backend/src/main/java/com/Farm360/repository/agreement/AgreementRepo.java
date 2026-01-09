package com.Farm360.repository.agreement;

import com.Farm360.model.agreement.AgreementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgreementRepo extends JpaRepository<AgreementEntity, Long> {

    //Prevent duplicates
    boolean existsByProposalId(Long proposalId);

    //Find by proposal
    Optional<AgreementEntity> findByProposalId(Long proposalId);

    //Find by buyer (all agreements for buyer)
    List<AgreementEntity> findByBuyerId(Long buyerId);

    //Find by farmer (all agreements for farmer)
    List<AgreementEntity> findByFarmerId(Long farmerId);

    //Optional: active agreements only (useful for UI)
    List<AgreementEntity> findByBuyerIdAndStatus(Long buyerId, com.Farm360.utils.AgreementStatus status);
}
