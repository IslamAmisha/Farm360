package com.Farm360.repository.cultivation;

import com.Farm360.model.cultivation.CultivationConcernEntity;
import com.Farm360.utils.CultivationConcernStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CultivationConcernRepository extends JpaRepository<CultivationConcernEntity, Long> {

    /**
     * Find all concerns for a specific cultivation execution.
     * Sorted by raisedAt ascending for auditability.
     */
    List<CultivationConcernEntity> findByCultivationExecutionIdOrderByRaisedAtAsc(Long cultivationExecutionId);

    /**
     * Find all concerns currently in a specific status for a cultivation execution.
     */
    List<CultivationConcernEntity> findByCultivationExecutionIdAndStatus(Long cultivationExecutionId, CultivationConcernStatus status);
}
