package com.Farm360.repository.module.input;

import com.Farm360.model.module.input.InputSupplyProofEntity;
import com.Farm360.model.module.input.InputSupplyOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InputSupplyProofRepository extends JpaRepository<InputSupplyProofEntity, Long> {

    List<InputSupplyProofEntity>
    findByOrderOrderByAttemptNoAsc(InputSupplyOrderEntity order);

    long countByOrder(InputSupplyOrderEntity order);

    boolean existsByOrderAndAttemptNo(
            InputSupplyOrderEntity order,
            Integer attemptNo
    );
}
