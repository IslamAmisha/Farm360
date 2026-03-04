package com.Farm360.repository.supply;

import com.Farm360.model.supply.SupplyExecutionOrderEntity;
import com.Farm360.utils.SupplierType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplyExecutionOrderRepository
        extends JpaRepository<SupplyExecutionOrderEntity, Long> {

    List<SupplyExecutionOrderEntity> findBySupplierUserId(Long supplierUserId);

    List<SupplyExecutionOrderEntity> findByAgreementId(Long agreementId);

    @Query("SELECT o FROM SupplyExecutionOrderEntity o " +
            "WHERE o.supplierType = :type AND o.status = 'SUPPLIER_NOTIFIED' " +
            "AND o.supplierUserId IS NULL")
    List<SupplyExecutionOrderEntity> findBroadcastRequestsForSupplierType(
            @Param("type") SupplierType type);

    @Query("SELECT COUNT(o) FROM SupplyExecutionOrderEntity o " +
            "WHERE o.supplierUserId = :uid " +
            "AND o.status IN ('SUPPLIER_ACCEPTED','DISPATCHED','FARMER_CONFIRMED','IN_TRANSIT')")
    Long countActiveOrders(@Param("uid") Long supplierUserId);

    @Query("SELECT COUNT(o) FROM SupplyExecutionOrderEntity o " +
            "WHERE o.supplierUserId = :uid AND o.status = 'FARMER_CONFIRMED'")
    Long countBillsPendingApproval(@Param("uid") Long supplierUserId);

    @Query("SELECT COUNT(o) FROM SupplyExecutionOrderEntity o " +
            "WHERE o.supplierUserId = :uid AND o.status = 'APPROVED'")
    Long countCompletedOrders(@Param("uid") Long supplierUserId);

    @Modifying
    @Query("UPDATE SupplyExecutionOrderEntity o SET o.status = 'APPROVED' " +
            "WHERE o.agreementId = :agreementId AND o.status != 'APPROVED'")
    void markAllStagesApproved(@Param("agreementId") Long agreementId);


    List<SupplyExecutionOrderEntity> findByAgreementIdIn(List<Long> agreementIds);
}