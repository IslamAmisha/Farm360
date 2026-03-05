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

    List<SupplyExecutionOrderEntity> findByAgreement_AgreementId(Long agreementId);

    @Query("SELECT o FROM SupplyExecutionOrderEntity o " +
            "WHERE o.supplierType = :type " +
            "AND o.status = com.Farm360.utils.SupplyStatus.SUPPLIER_NOTIFIED " +
            "AND o.supplierUserId IS NULL")
    List<SupplyExecutionOrderEntity> findBroadcastRequestsForSupplierType(
            @Param("type") SupplierType type);

    @Query("SELECT COUNT(o) FROM SupplyExecutionOrderEntity o " +
            "WHERE o.supplierUserId = :uid " +
            "AND o.status IN (" +
            "com.Farm360.utils.SupplyStatus.SUPPLIER_ACCEPTED, " +
            "com.Farm360.utils.SupplyStatus.DISPATCHED, " +
            "com.Farm360.utils.SupplyStatus.FARMER_CONFIRMED, " +
            "com.Farm360.utils.SupplyStatus.IN_TRANSIT)")
    Long countActiveOrders(@Param("uid") Long supplierUserId);

    @Query("SELECT COUNT(o) FROM SupplyExecutionOrderEntity o " +
            "WHERE o.supplierUserId = :uid " +
            "AND o.status = com.Farm360.utils.SupplyStatus.FARMER_CONFIRMED")
    Long countBillsPendingApproval(@Param("uid") Long supplierUserId);

    @Query("SELECT COUNT(o) FROM SupplyExecutionOrderEntity o " +
            "WHERE o.supplierUserId = :uid " +
            "AND o.status = com.Farm360.utils.SupplyStatus.APPROVED")
    Long countCompletedOrders(@Param("uid") Long supplierUserId);

    @Modifying
    @Query("UPDATE SupplyExecutionOrderEntity o SET o.status = com.Farm360.utils.SupplyStatus.APPROVED " +
            "WHERE o.agreement.agreementId = :agreementId " +
            "AND o.status != com.Farm360.utils.SupplyStatus.APPROVED")
    void markAllStagesApproved(@Param("agreementId") Long agreementId);


    List<SupplyExecutionOrderEntity> findByAgreement_AgreementIdIn(List<Long> agreementIds);
}