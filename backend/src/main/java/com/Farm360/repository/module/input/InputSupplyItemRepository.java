package com.Farm360.repository.module.input;

import com.Farm360.model.module.input.InputSupplyItemEntity;
import com.Farm360.model.module.input.InputSupplyOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InputSupplyItemRepository extends JpaRepository<InputSupplyItemEntity, Long> {

    List<InputSupplyItemEntity> findByOrder(InputSupplyOrderEntity order);

    List<InputSupplyItemEntity> findByOrderId(Long orderId);
}
