package com.Farm360.mapper;

import com.Farm360.dto.request.BuyerRegisterRQ;
import com.Farm360.dto.response.BuyerRS;
import com.Farm360.model.BuyerEntity;
import com.Farm360.model.crop.CropEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface BuyerMapper {

    // ------------ DTO → ENTITY ------------
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "wallet", ignore = true)
    @Mapping(target = "district", ignore = true)
    @Mapping(target = "block", ignore = true)
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "crops", ignore = true)
    @Mapping(target = "cropSubcategories", ignore = true)
    BuyerEntity mapToEntity(BuyerRegisterRQ rq);


    // ------------ ENTITY → DTO ------------
    @Mapping(source = "id", target = "id")
    @Mapping(source = "fullName", target = "fullName")
    @Mapping(source = "businessName", target = "businessName")

    @Mapping(source = "district.name", target = "district")
    @Mapping(source = "block.name", target = "block")
    @Mapping(source = "city.name", target = "city")

    @Mapping(source = "crops", target = "crops")
    BuyerRS mapEntityToRS(BuyerEntity entity);


    // ------------ CUSTOM MAPPER ------------
    default List<String> mapCrops(List<CropEntity> crops) {
        if (crops == null) return null;

        return crops.stream()
                .map(CropEntity::getName)
                .collect(Collectors.toList());
    }
}
