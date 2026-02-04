package com.Farm360.service.module.cultivation;

import com.Farm360.dto.request.module.cultivation.CultivationExecutionCreateRQ;
import com.Farm360.dto.response.module.cultivation.CultivationExecutionRS;
import com.Farm360.mapper.module.cultivation.CultivationMapper;  // ADDED
import com.Farm360.model.module.cultivation.CultivationExecutionEntity;
import com.Farm360.repository.module.cultivation.CultivationExecutionRepository;
import com.Farm360.dto.request.module.cultivation.CultivationExecutionCreateRQ;
import com.Farm360.dto.response.module.cultivation.CultivationExecutionRS;
import com.Farm360.mapper.module.cultivation.CultivationMapper;
import com.Farm360.model.agreement.AgreementEntity;
import com.Farm360.model.module.cultivation.CultivationExecutionEntity;
import com.Farm360.repository.agreement.AgreementRepo;
import com.Farm360.repository.module.cultivation.CultivationExecutionRepository;
import com.Farm360.utils.CultivationStatus;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CultivationExecutionServiceImpl implements CultivationExecutionService {

    private final CultivationExecutionRepository cultivationExecutionRepository;
    private final AgreementRepo agreementRepository;
    private final CultivationMapper cultivationMapper;

    @Override
    public CultivationExecutionRS createExecution(
            Long currentUserId,                    // <- injected from controller / security context
            CultivationExecutionCreateRQ rq
    ) {
        /* ---------------- STEP 1: Load Agreement (single source of truth) ---------------- */
        AgreementEntity agreement = agreementRepository
                .findById(rq.getAgreementId())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Agreement not found: " + rq.getAgreementId()
                        )
                );

        /* ---------------- STEP 2: Authorization ---------------- */
        // Only the farmer tied to this agreement can create a cultivation execution
        if (!agreement.getFarmerUserId().equals(currentUserId)) {
            throw new RuntimeException(
                    "Unauthorized: only farmer can create cultivation execution"
            );
        }

        /* ---------------- STEP 3: Map request → entity ---------------- */
        // Identity-blind: entity does not store farmerId/buyerId
        CultivationExecutionEntity entity = cultivationMapper.toEntity(rq);

        /* ---------------- STEP 4: Persist ---------------- */
        CultivationExecutionEntity saved = cultivationExecutionRepository.save(entity);

        /* ---------------- STEP 5: Map entity → response ---------------- */
        return cultivationMapper.toResponse(saved);
    }


    @Override
    public CultivationExecutionRS updateExecutionStatus(
            Long cultivationExecutionId,
            CultivationStatus newStatus
    ) {
        CultivationExecutionEntity entity =
                cultivationExecutionRepository.findById(cultivationExecutionId)
                        .orElseThrow(() ->
                                new EntityNotFoundException(
                                        "CultivationExecution not found: " + cultivationExecutionId
                                )
                        );

        entity.setStatus(newStatus);

        CultivationExecutionEntity updated =
                cultivationExecutionRepository.save(entity);

        return cultivationMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public CultivationExecutionRS getExecutionById(Long cultivationExecutionId) {
        return cultivationExecutionRepository.findById(cultivationExecutionId)
                .map(cultivationMapper::toResponse)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "CultivationExecution not found: " + cultivationExecutionId
                        )
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CultivationExecutionRS> getExecutionsByAgreement(Long agreementId) {
        return cultivationExecutionRepository.findByAgreementId(agreementId)
                .stream()
                .map(cultivationMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * This method is intentionally NOT supported anymore.
     * Farmer identity must be resolved via Agreement.
     */
    @Override
    public List<CultivationExecutionRS> getExecutionsByFarmer(Long farmerId) {
        throw new UnsupportedOperationException(
                "Querying cultivation executions by farmerId is not supported. " +
                        "Use agreement-based queries instead."
        );
    }
}
