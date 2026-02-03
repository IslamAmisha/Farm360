package com.Farm360.repository.module.cultivation;

import com.Farm360.model.module.cultivation.CultivationFeedbackEntity;
import com.Farm360.utils.CultivationFeedbackType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CultivationFeedbackRepository extends JpaRepository<CultivationFeedbackEntity, Long> {

    /**
     * Find all feedback entries for a specific cultivation execution.
     * Sorted by creation time ascending.
     */
    List<CultivationFeedbackEntity> findByCultivationExecutionIdOrderByCreatedAtAsc(Long cultivationExecutionId);

    /**
     * Find all feedback entries of a specific type for a cultivation execution.
     */
    List<CultivationFeedbackEntity> findByCultivationExecutionIdAndFeedbackType(Long cultivationExecutionId, CultivationFeedbackType feedbackType);
}
