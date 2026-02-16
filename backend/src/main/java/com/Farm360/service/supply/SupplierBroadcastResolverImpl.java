package com.Farm360.service.supply;


import com.Farm360.model.SupplierEntity;
import com.Farm360.repository.supplier.SupplierRepo;
import com.Farm360.utils.SupplierType;
import com.Farm360.utils.VerificationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierBroadcastResolverImpl implements SupplierBroadcastResolver {

    @Autowired
    private SupplierRepo supplierRepo;

    @Override
    public List<Long> resolveSuppliers(SupplierType supplierType) {

        List<SupplierEntity> suppliers =
                supplierRepo.findAllBySupplierTypeAndVerificationStatus(
                        supplierType,
                        VerificationStatus.VERIFIED
                );

        if (suppliers.isEmpty())
            throw new RuntimeException("No verified suppliers available for " + supplierType);

        return suppliers.stream()
                .map(s -> s.getUser().getId())
                .toList();
    }
}