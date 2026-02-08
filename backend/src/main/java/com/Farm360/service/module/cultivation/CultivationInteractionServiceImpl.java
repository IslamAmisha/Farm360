package com.Farm360.service.module.cultivation;

import com.Farm360.dto.request.module.cultivation.CultivationConcernCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationFeedbackCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationUpdateCreateRQ;
import com.Farm360.dto.response.module.cultivation.CultivationConcernRS;
import com.Farm360.dto.response.module.cultivation.CultivationFeedbackRS;
import com.Farm360.dto.response.module.cultivation.CultivationUpdateRS;
import com.Farm360.mapper.module.cultivation.CultivationMapper;
import com.Farm360.model.module.cultivation.CultivationConcernEntity;
import com.Farm360.model.module.cultivation.CultivationExecutionEntity;
import com.Farm360.model.module.cultivation.CultivationFeedbackEntity;
import com.Farm360.model.module.cultivation.CultivationUpdateEntity;
import com.Farm360.repository.module.cultivation.CultivationConcernRepository;
import com.Farm360.repository.module.cultivation.CultivationExecutionRepository;
import com.Farm360.repository.module.cultivation.CultivationFeedbackRepository;
import com.Farm360.repository.module.cultivation.CultivationUpdateRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
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

    /* ---------------- INTERNAL LOAD ---------------- */

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



        CultivationUpdateEntity entity =
                cultivationMapper.toEntity(rq);

        CultivationUpdateEntity saved =
                cultivationUpdateRepository.save(entity);


          // Touch farmer activity timestamp
        execution.setLastFarmerActionAt(Instant.now());
        cultivationExecutionRepository.save(execution);

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
                        .findByCultivationExecutionIdOrderByCreatedAtAsc(
                                cultivationExecutionId
                        )
        );
    }

    /* ---------------- BUYER FEEDBACK ---------------- */

    @Override
    public CultivationFeedbackRS addFeedback(CultivationFeedbackCreateRQ rq) {

        CultivationExecutionEntity execution =
                loadExecutionOrThrow(rq.getCultivationExecutionId());



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
                        .findByCultivationExecutionIdOrderByCreatedAtAsc(
                                cultivationExecutionId
                        )
        );
    }

    /* ---------------- BUYER CONCERNS ---------------- */

    @Override
    public CultivationConcernRS raiseConcern(CultivationConcernCreateRQ rq) {

        CultivationExecutionEntity execution =
                loadExecutionOrThrow(rq.getCultivationExecutionId());



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
                        .findByCultivationExecutionIdOrderByRaisedAtAsc(
                                cultivationExecutionId
                        )
        );
    }
}
