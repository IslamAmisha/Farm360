package com.Farm360.mapper;

import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.model.FarmerEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FarmerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "wallet", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "crops", ignore = true)
    @Mapping(target = "cropSubcategories", ignore = true)
    @Mapping(target = "district", ignore = true)
    @Mapping(target = "block", ignore = true)
    FarmerEntity mapToEntity(FarmerRegisterRQ rq);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "district.name", target = "districtName")
    @Mapping(source = "block.name", target = "blockName")
    FarmerRS mapEntityToRS(FarmerEntity entity);
}

