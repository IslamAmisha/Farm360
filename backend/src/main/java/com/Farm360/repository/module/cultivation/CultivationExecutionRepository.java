package com.Farm360.repository.module.cultivation;

import com.Farm360.model.module.cultivation.CultivationExecutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CultivationExecutionRepository extends JpaRepository<CultivationExecutionEntity, Long> {

    /**
     * Find all cultivation executions for a given farmer.
     */
    List<CultivationExecutionEntity> findByFarmerId(Long farmerId);

    /**
     * Find all cultivation executions associated with a specific agreement.
     */
    List<CultivationExecutionEntity> findByAgreementId(Long agreementId);
}
