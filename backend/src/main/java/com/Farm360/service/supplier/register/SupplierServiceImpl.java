package com.Farm360.service.supplier.register;

import com.Farm360.dto.request.supplier.SupplierRegisterRQ;
import com.Farm360.dto.response.supplier.SupplierRS;
import com.Farm360.mapper.SupplierMapper;
import com.Farm360.model.UserEntity;
import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.city.CityEntity;
import com.Farm360.model.master.district.DistrictEntity;
import com.Farm360.model.SupplierEntity;
import com.Farm360.repository.UserRepo;
import com.Farm360.repository.master.BlockRepo;
import com.Farm360.repository.master.CityRepo;
import com.Farm360.repository.master.DistrictRepo;
import com.Farm360.repository.supplier.SupplierRepo;
import com.Farm360.utils.Role;
import com.Farm360.utils.VerificationStatus;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class SupplierServiceImpl implements SupplierService {

    @Autowired private UserRepo userRepo;
    @Autowired private SupplierRepo supplierRepo;
    @Autowired private DistrictRepo districtRepo;
    @Autowired private BlockRepo blockRepo;
    @Autowired private CityRepo cityRepo;
    @Autowired private SupplierMapper mapper;

    @Override
    public SupplierRS register(Long userId, SupplierRegisterRQ rq) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getSupplier() != null) {
            throw new RuntimeException("Already registered as supplier");
        }

        DistrictEntity district = districtRepo.findById(rq.getDistrictId())
                .orElseThrow(() -> new RuntimeException("Invalid district"));

        BlockEntity block = blockRepo.findById(rq.getBlockId())
                .orElseThrow(() -> new RuntimeException("Invalid block"));

        CityEntity city = null;
        if (rq.getCityId() != null) {
            city = cityRepo.findById(rq.getCityId())
                    .orElseThrow(() -> new RuntimeException("Invalid city"));
        }

        SupplierEntity supplier = mapper.mapToEntity(rq);

        supplier.setDistrict(district);
        supplier.setBlock(block);
        supplier.setCity(city);
        supplier.setVerificationStatus(VerificationStatus.PENDING);
        supplier.setUser(user);

        supplierRepo.save(supplier);

        user.setSupplier(supplier);
        user.setRole(Role.supplier);
        userRepo.save(user);

        return mapper.mapEntityToRS(supplier);
    }

    @Override
    public SupplierRS getProfile(Long userId) {

        SupplierEntity supplier = supplierRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        return mapper.mapEntityToRS(supplier);
    }
}