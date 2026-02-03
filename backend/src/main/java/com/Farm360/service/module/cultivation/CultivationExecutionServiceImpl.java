package com.Farm360.service.module.cultivation;

import com.Farm360.dto.request.module.cultivation.CultivationExecutionCreateRQ;
import com.Farm360.dto.response.module.cultivation.CultivationExecutionRS;
import com.Farm360.mapper.module.cultivation.CultivationMapper;  // ADDED
import com.Farm360.model.module.cultivation.CultivationExecutionEntity;
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
    private final CultivationMapper cultivationMapper;  // ADDED - This is the key fix!

    @Override
    public CultivationExecutionRS createExecution(CultivationExecutionCreateRQ rq) {
        // CHANGED: Use mapper instead of direct builder
        CultivationExecutionEntity entity = cultivationMapper.toEntity(rq);

        CultivationExecutionEntity saved = cultivationExecutionRepository.save(entity);

        // CHANGED: Use mapper for response
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

        CultivationExecutionEntity updated = cultivationExecutionRepository.save(entity);

        // CHANGED: Use mapper for response
        return cultivationMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public CultivationExecutionRS getExecutionById(Long cultivationExecutionId) {
        // CHANGED: Use mapper via method reference
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
        // CHANGED: Use mapper via method reference
        return cultivationExecutionRepository.findByAgreementId(agreementId)
                .stream()
                .map(cultivationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CultivationExecutionRS> getExecutionsByFarmer(Long farmerId) {
        // CHANGED: Use mapper via method reference
        return cultivationExecutionRepository.findByFarmerId(farmerId)
                .stream()
                .map(cultivationMapper::toResponse)
                .collect(Collectors.toList());
    }

 }