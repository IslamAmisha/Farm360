package com.Farm360.repository.module.input;

import com.Farm360.model.module.input.InputSupplyApprovalEntity;
import com.Farm360.model.module.input.InputSupplyOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InputSupplyApprovalRepository extends JpaRepository<InputSupplyApprovalEntity, Long> {

    Optional<InputSupplyApprovalEntity> findByOrder(InputSupplyOrderEntity order);

    boolean existsByOrder(InputSupplyOrderEntity order);
}
