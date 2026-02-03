package com.Farm360.service.cultivation;

import com.Farm360.dto.request.cultivation.CultivationConcernCreateRQ;
import com.Farm360.dto.request.cultivation.CultivationFeedbackCreateRQ;
import com.Farm360.dto.request.cultivation.CultivationUpdateCreateRQ;
import com.Farm360.dto.response.cultivation.CultivationConcernRS;
import com.Farm360.dto.response.cultivation.CultivationFeedbackRS;
import com.Farm360.dto.response.cultivation.CultivationUpdateRS;
import com.Farm360.mapper.cultivation.CultivationMapper;
import com.Farm360.model.cultivation.CultivationConcernEntity;
import com.Farm360.model.cultivation.CultivationExecutionEntity;
import com.Farm360.model.cultivation.CultivationFeedbackEntity;
import com.Farm360.model.cultivation.CultivationUpdateEntity;
import com.Farm360.repository.cultivation.CultivationConcernRepository;
import com.Farm360.repository.cultivation.CultivationExecutionRepository;
import com.Farm360.repository.cultivation.CultivationFeedbackRepository;
import com.Farm360.repository.cultivation.CultivationUpdateRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CultivationInteractionServiceImpl
        implements CultivationInteractionService {

    private final CultivationExecutionRepository cultivationExecutionRepository;
    private final CultivationUpdateRepository cultivationUpdateRepository;
    private final CultivationFeedbackRepository cultivationFeedbackRepository;
    private final CultivationConcernRepository cultivationConcernRepository;
    private final CultivationMapper cultivationMapper;

    /* ---------------- INTERNAL VALIDATION ---------------- */

    private CultivationExecutionEntity loadExecutionOrThrow(Long executionId) {
        return cultivationExecutionRepository.findById(executionId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "CultivationExecution not found: " + executionId
                        )
                );
    }

    /* ---------------- FARMER UPDATES ---------------- */

    @Override
    public CultivationUpdateRS addUpdate(CultivationUpdateCreateRQ rq) {

        CultivationExecutionEntity execution =
                loadExecutionOrThrow(rq.getCultivationExecutionId());

        // NOTE:
        // Farmer ownership validation (if any) is assumed
        // to be enforced at controller/security layer.

        CultivationUpdateEntity entity =
                cultivationMapper.toEntity(rq);

        CultivationUpdateEntity saved =
                cultivationUpdateRepository.save(entity);

        return cultivationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CultivationUpdateRS> getUpdatesByExecution(
            Long cultivationExecutionId
    ) {
        loadExecutionOrThrow(cultivationExecutionId);

        return cultivationMapper.toUpdateResponseList(
                cultivationUpdateRepository
                        .findByCultivationExecutionIdOrderByCreatedAtAsc(cultivationExecutionId)
        );
    }

    /* ---------------- BUYER FEEDBACK ---------------- */

    @Override
    public CultivationFeedbackRS addFeedback(CultivationFeedbackCreateRQ rq) {

        CultivationExecutionEntity execution =
                loadExecutionOrThrow(rq.getCultivationExecutionId());

        // Buyer ownership check intentionally NOT duplicated here.
        // Execution already carries buyerId for upstream validation.

        CultivationFeedbackEntity entity =
                cultivationMapper.toEntity(rq);

        CultivationFeedbackEntity saved =
                cultivationFeedbackRepository.save(entity);

        return cultivationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CultivationFeedbackRS> getFeedbackByExecution(
            Long cultivationExecutionId
    ) {
        loadExecutionOrThrow(cultivationExecutionId);

        return cultivationMapper.toFeedbackResponseList(
                cultivationFeedbackRepository
                        .findByCultivationExecutionIdOrderByCreatedAtAsc(cultivationExecutionId)
        );
    }

    /* ---------------- BUYER CONCERNS ---------------- */

    @Override
    public CultivationConcernRS raiseConcern(CultivationConcernCreateRQ rq) {

        CultivationExecutionEntity execution =
                loadExecutionOrThrow(rq.getCultivationExecutionId());

        // Critical invariant:
        // Concern must be raised by the buyer tied to execution.
        if (!execution.getBuyerId().equals(rq.getBuyerId())) {
            throw new IllegalStateException(
                    "Buyer not authorized to raise concern for this cultivation execution"
            );
        }

        CultivationConcernEntity entity =
                cultivationMapper.toEntity(rq);

        CultivationConcernEntity saved =
                cultivationConcernRepository.save(entity);

        return cultivationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CultivationConcernRS> getConcernsByExecution(
            Long cultivationExecutionId
    ) {
        loadExecutionOrThrow(cultivationExecutionId);

        return cultivationMapper.toConcernResponseList(
                cultivationConcernRepository
                        .findByCultivationExecutionIdOrderByRaisedAtAsc(cultivationExecutionId)
        );
    }
}
