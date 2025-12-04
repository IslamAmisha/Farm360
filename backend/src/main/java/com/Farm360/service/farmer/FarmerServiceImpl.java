package com.Farm360.service.farmer;

import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.mapper.FarmerMapper;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.UserEntity;
import com.Farm360.model.block.BlockEntity;
import com.Farm360.model.crop.CropEntity;
import com.Farm360.model.cropsubcategories.CropSubCategoriesEntity;
import com.Farm360.model.district.DistrictEntity;
import com.Farm360.model.payment.FarmerWallet;
import com.Farm360.repository.*;
import com.Farm360.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class FarmerServiceImpl implements FarmerService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private FarmerRepo farmerRepo;
    @Autowired
    private CropRepo cropRepo;
    @Autowired
    private CropSubCategoriesRepo subCategoryRepo;
    @Autowired
    private FarmerMapper farmerMapper;
    @Autowired
    private DistrictRepo districtRepo;
    @Autowired
    private BlockRepo blockRepo;


    @Override
    public FarmerRS register(Long userId, FarmerRegisterRQ rq) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Invalid userId"));

        FarmerEntity farmer = farmerMapper.mapToEntity(rq);

        farmer.setUser(user);
        user.setFarmer(farmer);   // bidirectional fix

        user.setRole(Role.FARMER);

        userRepo.save(user);

        farmer.setDistrict(
                districtRepo.findById(rq.getDistrictId())
                        .orElseThrow(() -> new RuntimeException("Invalid district"))
        );
        farmer.setBlock(
                blockRepo.findById(rq.getBlockId())
                        .orElseThrow(() -> new RuntimeException("Invalid block"))
        );

        farmer.setCrops(
                rq.getCropIds() == null ? List.of() : cropRepo.findAllById(rq.getCropIds())
        );

        farmer.setCropSubcategories(
                rq.getSubCategoryIds() == null ? List.of() : subCategoryRepo.findAllById(rq.getSubCategoryIds())
        );


        FarmerWallet wallet = new FarmerWallet();
        wallet.setFarmer(farmer);
        farmer.setWallet(wallet);

        FarmerEntity saved = farmerRepo.save(farmer);

        saved.getCrops().size();
        saved.getCropSubcategories().size();

        return farmerMapper.mapEntityToRS(saved);
    }

}
