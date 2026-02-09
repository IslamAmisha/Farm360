package com.Farm360.service.supplier.profile;

import com.Farm360.dto.response.supplier.SupplierRS;
import com.Farm360.mapper.SupplierMapper;
import com.Farm360.model.SupplierEntity;
import com.Farm360.repository.supplier.SupplierRepo;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SupplierProfileServiceImpl implements SupplierProfileService {

    @Autowired
    private SupplierRepo supplierRepo;

    @Autowired
    private SupplierMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public SupplierRS getProfile(Long userId) {

        SupplierEntity supplier = supplierRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        return mapper.mapEntityToRS(supplier);
    }
}