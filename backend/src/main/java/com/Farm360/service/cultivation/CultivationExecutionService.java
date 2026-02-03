package com.Farm360.service.cultivation;



import com.Farm360.dto.request.cultivation.CultivationExecutionCreateRQ;
import com.Farm360.dto.response.cultivation.CultivationExecutionRS;
import com.Farm360.utils.CultivationStatus;

import java.util.List;

public interface CultivationExecutionService {

    /**
     * Initialize a cultivation execution for an active agreement.
     * Usually system-triggered at agreement activation.
     */
    CultivationExecutionRS createExecution(CultivationExecutionCreateRQ rq);

    /**
     * System-controlled status transition.
     * No direct user access.
     */
    CultivationExecutionRS updateExecutionStatus(
            Long cultivationExecutionId,
            CultivationStatus newStatus
    );

    /**
     * Fetch a single cultivation execution.
     */
    CultivationExecutionRS getExecutionById(Long cultivationExecutionId);

    /**
     * Fetch all cultivation executions for an agreement.
     */
    List<CultivationExecutionRS> getExecutionsByAgreement(Long agreementId);

    /**
     * Fetch all cultivation executions for a farmer.
     */
    List<CultivationExecutionRS> getExecutionsByFarmer(Long farmerId);
}
