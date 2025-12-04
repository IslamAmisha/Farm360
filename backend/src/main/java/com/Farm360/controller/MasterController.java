package com.Farm360.controller;


import com.Farm360.model.block.BlockEntity;
import com.Farm360.model.city.CityEntity;
import com.Farm360.model.crop.CropEntity;
import com.Farm360.model.cropsubcategories.CropSubCategoriesEntity;
import com.Farm360.model.district.DistrictEntity;
import com.Farm360.service.master.MasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/master")
@CrossOrigin("*")
public class MasterController {

    @Autowired
    private MasterService masterService;

    @GetMapping("/districts")
    public List<DistrictEntity> getDistricts() {
        return masterService.getAllDistricts();
    }

    @GetMapping("/districts/{districtId}/blocks")
    public List<BlockEntity> getBlocks(@PathVariable Long districtId) {
        return masterService.getBlocksByDistrict(districtId);
    }

    @GetMapping("/blocks/{blockId}/cities")
    public List<CityEntity> getCities(@PathVariable Long blockId) {
        return masterService.getCitiesByBlock(blockId);
    }

    @GetMapping("/crops")
    public List<CropEntity> getCrops() {
        return masterService.getAllCrops();
    }

    @GetMapping("/crops/{cropId}/subcategories")
    public List<CropSubCategoriesEntity> getSubcategories(@PathVariable Long cropId) {
        return masterService.getSubcategoriesByCrop(cropId);
    }
}



