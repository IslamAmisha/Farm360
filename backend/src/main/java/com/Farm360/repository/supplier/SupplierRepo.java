package com.Farm360.repository.supplier;

import com.Farm360.model.SupplierEntity;
import com.Farm360.utils.SupplierType;
import com.Farm360.utils.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SupplierRepo extends JpaRepository<SupplierEntity, Long> {

    Optional<SupplierEntity> findByUser_Id(Long userId);

    Optional<SupplierEntity>
    findFirstBySupplierTypeAndVerificationStatus(
            SupplierType supplierType,
            VerificationStatus verificationStatus
    );
}