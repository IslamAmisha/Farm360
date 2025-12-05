package com.Farm360.service.master;

import com.Farm360.model.block.BlockEntity;
import com.Farm360.model.city.CityEntity;
import com.Farm360.model.crop.CropEntity;
import com.Farm360.model.cropsubcategories.CropSubCategoriesEntity;
import com.Farm360.model.district.DistrictEntity;

import java.util.List;

public interface MasterService {

    List<DistrictEntity> getAllDistricts();

    List<BlockEntity> getBlocksByDistrict(Long districtId);

    List<CityEntity> getCitiesByBlock(Long blockId);

    List<CropEntity> getAllCrops();

    List<CropSubCategoriesEntity> getSubcategoriesByCrop(Long cropId);
}
