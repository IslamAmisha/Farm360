package com.Farm360.repository.module.input;

import com.Farm360.model.module.input.InputSupplyOrderEntity;
import com.Farm360.utils.InputSupplyStatus;
import com.Farm360.utils.InputSupplyStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface InputSupplyOrderRepository extends JpaRepository<InputSupplyOrderEntity, Long> {

    List<InputSupplyOrderEntity> findByAgreementId(Long agreementId);

    List<InputSupplyOrderEntity> findByStage(InputSupplyStage stage);

    List<InputSupplyOrderEntity>
    findByStageAndUploadDueAtBefore(
            InputSupplyStage stage,
            LocalDateTime now
    );

    List<InputSupplyOrderEntity>
    findByStageAndApprovalDueAtBefore(
            InputSupplyStage stage,
            LocalDateTime now
    );

    boolean existsByAgreementIdAndStatusIn(
            Long agreementId,
            List<InputSupplyStatus> statuses
    );

    List<InputSupplyOrderEntity> findByStatusAndApprovalDueAtBefore(InputSupplyStatus inputSupplyStatus, LocalDateTime now);
}

