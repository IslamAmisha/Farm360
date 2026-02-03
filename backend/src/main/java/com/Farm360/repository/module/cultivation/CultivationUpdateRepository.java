package com.Farm360.repository.module.cultivation;

import com.Farm360.model.module.cultivation.CultivationUpdateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CultivationUpdateRepository extends JpaRepository<CultivationUpdateEntity, Long> {

    /**
     * Find all updates for a specific cultivation execution.
     * Sorted by creation time ascending.
     */
    List<CultivationUpdateEntity> findByCultivationExecutionIdOrderByCreatedAtAsc(Long cultivationExecutionId);
}
