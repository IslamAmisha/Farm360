package com.Farm360.service.module.cultivation;

import com.Farm360.dto.request.module.cultivation.CultivationConcernCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationFeedbackCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationUpdateCreateRQ;
import com.Farm360.dto.response.module.cultivation.CultivationConcernRS;
import com.Farm360.dto.response.module.cultivation.CultivationFeedbackRS;
import com.Farm360.dto.response.module.cultivation.CultivationUpdateRS;

import java.util.List;

public interface CultivationInteractionService {

    /* ---------------- FARMER UPDATES ---------------- */

    /**
     * Farmer posts a cultivation update.
     * Append-only, execution-scoped.
     */
    CultivationUpdateRS addUpdate(CultivationUpdateCreateRQ rq);

    /**
     * Fetch all updates for a cultivation execution.
     */
    List<CultivationUpdateRS> getUpdatesByExecution(Long cultivationExecutionId);

    /* ---------------- BUYER FEEDBACK ---------------- */

    /**
     * Buyer submits feedback (COMMENT / APPROVAL / QUALITY_CONCERN).
     * Observational — does not mutate execution state.
     */
    CultivationFeedbackRS addFeedback(CultivationFeedbackCreateRQ rq);

    /**
     * Fetch all feedback entries for a cultivation execution.
     */
    List<CultivationFeedbackRS> getFeedbackByExecution(Long cultivationExecutionId);

    /* ---------------- BUYER CONCERNS ---------------- */

    /**
     * Buyer raises a formal concern.
     * Still execution-scoped, not problem-section escalation.
     */
    CultivationConcernRS raiseConcern(CultivationConcernCreateRQ rq);

    /**
     * Fetch all concerns under a cultivation execution.
     */
    List<CultivationConcernRS> getConcernsByExecution(Long cultivationExecutionId);
}
