package com.Farm360.service.master;

import com.Farm360.model.block.BlockEntity;
import com.Farm360.model.city.CityEntity;
import com.Farm360.model.crop.CropEntity;
import com.Farm360.model.cropsubcategories.CropSubCategoriesEntity;
import com.Farm360.model.district.DistrictEntity;
import com.Farm360.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MasterServiceImpl implements MasterService{

    @Autowired
    private DistrictRepo districtRepo;
    @Autowired
    private BlockRepo blockRepo;
    @Autowired
    private  CityRepo cityRepo;
    @Autowired
    private CropRepo cropRepo;
    @Autowired
    private CropSubCategoriesRepo subCategoryRepo;

    @Override
    public List<DistrictEntity> getAllDistricts() {
        return districtRepo.findAll();
    }

    @Override
    public List<BlockEntity> getBlocksByDistrict(Long districtId) {
        return blockRepo.findByDistrictId(districtId);
    }

    @Override
    public List<CityEntity> getCitiesByBlock(Long blockId) {
        return cityRepo.findByBlockId(blockId);
    }

    @Override
    public List<CropEntity> getAllCrops() {
        return cropRepo.findAll();
    }

    @Override
    public List<CropSubCategoriesEntity> getSubcategoriesByCrop(Long cropId) {
        return subCategoryRepo.findByCropId(cropId);
    }
}
