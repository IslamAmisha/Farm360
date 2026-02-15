package com.Farm360.repository.supply;

import com.Farm360.model.supply.SupplyExecutionOrderEntity;
import com.Farm360.utils.SupplyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface  SupplyExecutionOrderRepository extends JpaRepository<SupplyExecutionOrderEntity, Long> {

    List< SupplyExecutionOrderEntity> findByAgreementId(Long agreementId);

    List< SupplyExecutionOrderEntity>
    findBySupplierUserIdAndStatus(Long supplierUserId, SupplyStatus status);

    @Modifying
    @Query("""
UPDATE SupplyExecutionOrderEntity o
SET o.status = 'APPROVED'
WHERE o.agreementId = :agreementId
""")
    void markAllStagesApproved(Long agreementId);
}