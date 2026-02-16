package com.Farm360.repository.supply;

import com.Farm360.model.SupplierEntity;
import com.Farm360.model.supply.SupplyExecutionOrderEntity;
import com.Farm360.utils.SupplierType;
import com.Farm360.utils.SupplyStatus;
import com.Farm360.utils.VerificationStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface  SupplyExecutionOrderRepository extends JpaRepository<SupplyExecutionOrderEntity, Long> {

    List< SupplyExecutionOrderEntity> findByAgreementId(Long agreementId);


    @Modifying
    @Query("""
UPDATE SupplyExecutionOrderEntity o
SET o.status = 'APPROVED'
WHERE o.agreementId = :agreementId
""")
    void markAllStagesApproved(Long agreementId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<SupplyExecutionOrderEntity> findById(Long id);
}