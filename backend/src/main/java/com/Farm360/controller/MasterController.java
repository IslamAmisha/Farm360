package com.Farm360.controller;


import com.Farm360.dto.response.master.*;
import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.city.CityEntity;
import com.Farm360.model.master.crop.CropEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.model.master.district.DistrictEntity;
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
    public List<DistrictRS> getDistricts() {
        return masterService.getAllDistricts()
                .stream()
                .map(d -> new DistrictRS(d.getId(), d.getName()))
                .toList();
    }

    @GetMapping("/blocks/{districtId}")
    public List<BlockRS> getBlocks(@PathVariable Long districtId) {
        return masterService.getBlocksByDistrict(districtId)
                .stream()
                .map(b -> new BlockRS(b.getId(), b.getName()))
                .toList();
    }

    @GetMapping("/cities/{blockId}")
    public List<CityRS> getCities(@PathVariable Long blockId) {
        return masterService.getCitiesByBlock(blockId)
                .stream()
                .map(c -> new CityRS(c.getId(), c.getName()))
                .toList();
    }

    @GetMapping("/crops")
    public List<CropRS> getCrops() {
        return masterService.getAllCrops()
                .stream()
                .map(c -> new CropRS(c.getId(), c.getName()))
                .toList();
    }

    @GetMapping("/subcategories/{cropId}")
    public List<SubcategoryRS> getSubcategories(@PathVariable Long cropId) {
        return masterService.getSubcategoriesByCrop(cropId)
                .stream()
                .map(sc -> new SubcategoryRS(sc.getId(), sc.getName()))
                .toList();
    }
}



