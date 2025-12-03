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
import com.Farm360.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmerServiceImpl implements FarmerService{

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
        public FarmerRS register(FarmerRegisterRQ rq) {

            UserEntity user = userRepo.findById(rq.getUserId())
                    .orElseThrow(() -> new RuntimeException("Invalid userId"));

            FarmerEntity farmer = farmerMapper.mapToEntity(rq);

            farmer.setUser(user);
            user.setFarmer(farmer);


            DistrictEntity district = districtRepo.findById(rq.getDistrictId())
                    .orElseThrow(() -> new RuntimeException("Invalid district"));
            farmer.setDistrict(district);

            BlockEntity block = blockRepo.findById(rq.getBlockId())
                    .orElseThrow(() -> new RuntimeException("Invalid block"));
            farmer.setBlock(block);

            if (rq.getCropIds() != null) {
                List<CropEntity> crops = cropRepo.findAllById(rq.getCropIds());
                farmer.setCrops(crops);
            }

            if (rq.getSubCategoryIds() != null) {
                List<CropSubCategoriesEntity> subCats = subCategoryRepo.findAllById(rq.getSubCategoryIds());
                farmer.setCropSubcategories(subCats);
            }


            FarmerEntity saved = farmerRepo.save(farmer);
            return farmerMapper.mapEntityToRS(saved);
        }

}

