package com.Farm360.repository.master.items;

import com.Farm360.model.master.items.SupplyItemName;
import com.Farm360.utils.SupplierType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplyItemNameRepository extends JpaRepository<SupplyItemName, Long> {

    boolean existsBySupplierTypeAndNameIgnoreCase(
            SupplierType supplierType,
            String name
    );

    List<SupplyItemName> findBySupplierTypeAndActiveTrue(
            SupplierType supplierType
    );
}