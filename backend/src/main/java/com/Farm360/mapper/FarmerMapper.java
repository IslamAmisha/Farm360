package com.Farm360.mapper;

import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.master.crop.CropEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface FarmerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "wallet", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "district", ignore = true)
    @Mapping(target = "block", ignore = true)
    @Mapping(target = "crops", ignore = true)
    @Mapping(target = "cropSubcategories", ignore = true)
    @Mapping(target = "landPhotoUrl", ignore = true)  // if you initialize manually
    FarmerEntity mapToEntity(FarmerRegisterRQ rq);


    @Mapping(source = "user.id",       target = "userId")
    @Mapping(source = "district.name", target = "districtName")
    @Mapping(source = "block.name",    target = "blockName")
    @Mapping(source = "crops",         target = "crops")
    @Mapping(source = "cropSubcategories", target = "cropSubcategories")
    FarmerRS mapEntityToRS(FarmerEntity entity);


    default List<String> mapCrops(List<CropEntity> crops) {
        if (crops == null) return null;
        return crops.stream()
                .map(CropEntity::getName)
                .collect(Collectors.toList());
    }

    default List<String> mapSubcategories(List<CropSubCategoriesEntity> subs) {
        if (subs == null) return null;
        return subs.stream()
                .map(CropSubCategoriesEntity::getName)
                .collect(Collectors.toList());
    }
}
