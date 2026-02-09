package com.Farm360.mapper;

import com.Farm360.dto.request.supplier.SupplierRegisterRQ;
import com.Farm360.dto.response.supplier.SupplierRS;
import com.Farm360.model.SupplierEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SupplierMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)

    @Mapping(target = "district", ignore = true)
    @Mapping(target = "block", ignore = true)
    @Mapping(target = "city", ignore = true)

    @Mapping(target = "verificationStatus", ignore = true)

    SupplierEntity mapToEntity(SupplierRegisterRQ rq);


    @Mapping(source = "id", target = "supplierId")
    @Mapping(source = "user.id", target = "userId")

    @Mapping(source = "district.name", target = "districtName")
    @Mapping(source = "block.name", target = "blockName")
    @Mapping(source = "city.name", target = "cityName")

    SupplierRS mapEntityToRS(SupplierEntity entity);
}