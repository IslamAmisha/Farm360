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
import org.springframework.data.repository.query.Param;

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

    @Query("""
       SELECT COUNT(o)
       FROM SupplyExecutionOrderEntity o
       WHERE o.supplierUserId = :supplierUserId
       AND o.status IN (
            com.Farm360.utils.SupplyStatus.SUPPLIER_ACCEPTED,
            com.Farm360.utils.SupplyStatus.DISPATCHED,
            com.Farm360.utils.SupplyStatus.FARMER_CONFIRMED,
            com.Farm360.utils.SupplyStatus.IN_TRANSIT,
            com.Farm360.utils.SupplyStatus.BUYER_CONFIRMED
       )
       """)
    Long countActiveOrders(@Param("supplierUserId") Long supplierUserId);


    @Query("""
       SELECT COUNT(o)
       FROM SupplyExecutionOrderEntity o
       WHERE o.supplierUserId = :supplierUserId
       AND o.invoice IS NOT NULL
       AND o.escrowStatus = com.Farm360.utils.EscrowReleaseStatus.HELD
       """)
    Long countBillsPendingApproval(@Param("supplierUserId") Long supplierUserId);


    @Query("""
       SELECT COUNT(o)
       FROM SupplyExecutionOrderEntity o
       WHERE o.supplierUserId = :supplierUserId
       AND o.status = com.Farm360.utils.SupplyStatus.APPROVED
       """)
    Long countCompletedOrders(@Param("supplierUserId") Long supplierUserId);
}