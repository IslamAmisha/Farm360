package com.Farm360.service.master;

import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.city.CityEntity;
import com.Farm360.model.master.crop.CropEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.model.master.district.DistrictEntity;

import java.util.List;

public interface MasterService {

    List<DistrictEntity> getAllDistricts();

    List<BlockEntity> getBlocksByDistrict(Long districtId);

    List<CityEntity> getCitiesByBlock(Long blockId);

    List<CropEntity> getAllCrops();

    List<CropSubCategoriesEntity> getSubcategoriesByCrop(Long cropId);
}
