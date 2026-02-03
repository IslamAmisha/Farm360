package com.Farm360.mapper.module.cultivation;

import com.Farm360.dto.request.module.cultivation.CultivationConcernCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationExecutionCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationFeedbackCreateRQ;
import com.Farm360.dto.request.module.cultivation.CultivationUpdateCreateRQ;
import com.Farm360.dto.response.module.cultivation.CultivationConcernRS;
import com.Farm360.dto.response.module.cultivation.CultivationExecutionRS;
import com.Farm360.dto.response.module.cultivation.CultivationFeedbackRS;
import com.Farm360.dto.response.module.cultivation.CultivationUpdateRS;
import com.Farm360.model.module.cultivation.CultivationConcernEntity;
import com.Farm360.model.module.cultivation.CultivationExecutionEntity;
import com.Farm360.utils.CultivationStatus;
import com.Farm360.utils.CultivationConcernStatus;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class CultivationMapper {

    private final ZoneId zoneId = ZoneId.of("Asia/Kolkata");

    /* ========== UTILITY METHODS ========== */

    private LocalDateTime toLocalDateTime(Date date) {
        return date != null ?
                date.toInstant().atZone(zoneId).toLocalDateTime() : null;
    }

    private Date toDate(LocalDateTime localDateTime) {
        return localDateTime != null ?
                Date.from(localDateTime.atZone(zoneId).toInstant()) : null;
    }

    private LocalDateTime toLocalDateTime(Instant instant) {
        return instant != null ?
                instant.atZone(zoneId).toLocalDateTime() : null;
    }

    private Instant toInstant(LocalDateTime localDateTime) {
        return localDateTime != null ?
                localDateTime.atZone(zoneId).toInstant() : null;
    }

    private Date instantToDate(Instant instant) {
        return instant != null ?
                Date.from(instant) : null;
    }

    /* ========== EXECUTION MAPPING ========== */

    public CultivationExecutionEntity toEntity(CultivationExecutionCreateRQ rq) {
        if (rq == null) return null;

        return CultivationExecutionEntity.builder()
                .agreementId(rq.getAgreementId())
                .farmerId(rq.getFarmerId())
                .buyerId(rq.getBuyerId())
                .startWindowFrom(rq.getCultivationStartDate())
                .startWindowTo(rq.getExpectedHarvestStartDate())
                .expectedCompletionDate(rq.getExpectedHarvestEndDate())
                .hardExpiryDate(calculateHardExpiryDate(rq.getExpectedHarvestEndDate()))
                .status(CultivationStatus.STARTED)
                .build();
    }

    public CultivationExecutionRS toResponse(CultivationExecutionEntity entity) {
        if (entity == null) return null;

        return CultivationExecutionRS.builder()
                .cultivationExecutionId(entity.getId())
                .agreementId(entity.getAgreementId())
                .farmerId(entity.getFarmerId())
                .buyerId(entity.getBuyerId())
                .cultivationStartDate(entity.getStartWindowFrom())
                .expectedHarvestStartDate(entity.getStartWindowTo())
                .expectedHarvestEndDate(entity.getExpectedCompletionDate())
                .status(entity.getStatus())
                .createdAt(toLocalDateTime(entity.getCreatedDate()))
                .lastUpdatedAt(toLocalDateTime(entity.getModifiedDate()))
                .build();
    }

    private LocalDate calculateHardExpiryDate(LocalDate harvestEndDate) {
        // Business logic: hard expiry is 3 months after harvest end
        return harvestEndDate != null ?
                harvestEndDate.plusMonths(3) : null;
    }

    /* ========== CONCERN MAPPING ========== */

    public CultivationConcernEntity toEntity(CultivationConcernCreateRQ rq) {
        if (rq == null) return null;

        return CultivationConcernEntity.builder()
                .cultivationExecutionId(rq.getCultivationExecutionId())
                .raisedByBuyerId(rq.getBuyerId())
                .summary(rq.getDescription())
                .status(CultivationConcernStatus.OPEN)
                .raisedAt(Instant.now())
                .build();
    }


    public CultivationConcernRS toResponse(CultivationConcernEntity entity) {
        if (entity == null) return null;

        return CultivationConcernRS.builder()
                .cultivationConcernId(entity.getId())
                .cultivationExecutionId(entity.getCultivationExecutionId())
                .buyerId(entity.getRaisedByBuyerId())
                .description(entity.getSummary())
                .status(entity.getStatus())
                .raisedAt(toLocalDateTime(entity.getRaisedAt()))
                .resolvedAt(toLocalDateTime(entity.getResolvedAt()))
                .escalatedAt(toLocalDateTime(entity.getEscalatedAt()))


                .build();
    }

    /* ========== FEEDBACK MAPPING ========== */

    public CultivationFeedbackEntity toEntity(CultivationFeedbackCreateRQ rq) {
        if (rq == null) return null;

        return CultivationFeedbackEntity.builder()
                .cultivationExecutionId(rq.getCultivationExecutionId())
                .buyerId(rq.getBuyerId())
                .feedbackType(rq.getFeedbackType())
                .message(rq.getRemarks())
                .createdAt(Instant.now())
                .build();
    }

    public CultivationFeedbackRS toResponse(CultivationFeedbackEntity entity) {
        if (entity == null) return null;

        return CultivationFeedbackRS.builder()
                .cultivationFeedbackId(entity.getId())
                .cultivationExecutionId(entity.getCultivationExecutionId())
                .buyerId(entity.getBuyerId())
                .feedbackType(entity.getFeedbackType())
                .remarks(entity.getMessage())
                .createdAt(toLocalDateTime(entity.getCreatedAt()))
                .build();
    }

    /* ========== UPDATE MAPPING ========== */

    public CultivationUpdateEntity toEntity(CultivationUpdateCreateRQ rq) {
        if (rq == null) return null;

        return CultivationUpdateEntity.builder()
                .cultivationExecutionId(rq.getCultivationExecutionId())
                .updateType(rq.getUpdateType())
                .contentRef(rq.getRemarks())
                .createdAt(Instant.now())
                .build();
    }

    public CultivationUpdateRS toResponse(CultivationUpdateEntity entity) {
        if (entity == null) return null;

        return CultivationUpdateRS.builder()
                .cultivationUpdateId(entity.getId())
                .cultivationExecutionId(entity.getCultivationExecutionId())
                .updateType(entity.getUpdateType())
                .remarks(entity.getContentRef())
                .createdAt(toLocalDateTime(entity.getCreatedAt()))
                .build();
    }

    /* ========== PARTIAL/UPDATES ========== */

    public void updateEntityFromRequest(CultivationExecutionEntity entity,
                                        CultivationExecutionCreateRQ rq) {
        if (entity == null || rq == null) return;

        entity.setStartWindowFrom(rq.getCultivationStartDate());
        entity.setStartWindowTo(rq.getExpectedHarvestStartDate());
        entity.setExpectedCompletionDate(rq.getExpectedHarvestEndDate());
        entity.setHardExpiryDate(calculateHardExpiryDate(rq.getExpectedHarvestEndDate()));
    }

    public void updateConcernEntity(CultivationConcernEntity entity,
                                    String description,
                                    CultivationConcernStatus status) {
        if (entity == null) return;

        if (description != null) {
            entity.setSummary(description);
        }

        if (status != null) {
            entity.setStatus(status);
            if (status == CultivationConcernStatus.ESCALATED) {
                entity.setEscalatedAt(Instant.now());
            }
            if (status == CultivationConcernStatus.RESOLVED) {
                entity.setResolvedAt(Instant.now());
            }

        }
    }

    /* ========== BATCH MAPPING ========== */

    public List<CultivationExecutionRS> toResponseList(List<CultivationExecutionEntity> entities) {
        if (entities == null) return Collections.emptyList();

        return entities.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CultivationConcernRS> toConcernResponseList(List<CultivationConcernEntity> entities) {
        if (entities == null) return Collections.emptyList();

        return entities.stream()
                .map(this::toResponse)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<CultivationFeedbackRS> toFeedbackResponseList(List<CultivationFeedbackEntity> entities) {
        if (entities == null) return Collections.emptyList();

        return entities.stream()
                .map(this::toResponse)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public List<CultivationUpdateRS> toUpdateResponseList(List<CultivationUpdateEntity> entities) {
        if (entities == null) return Collections.emptyList();

        return entities.stream()
                .map(this::toResponse)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}