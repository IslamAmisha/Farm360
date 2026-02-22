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
    @Mapping(source = "village", target = "village")
    @Mapping(source = "pinCode", target = "pinCode")
    @Mapping(source = "supplierName", target = "supplierName")
    @Mapping(source = "businessName", target = "businessName")
    @Mapping(source = "user.phoneNumber", target = "phoneNumber")
    @Mapping(source = "panNumber", target = "panNumber")
    @Mapping(source = "gstNumber", target = "gstNumber")
    @Mapping(source = "bankAccountNo", target = "bankAccountNo")
    @Mapping(source = "supplierType", target = "supplierType")
    @Mapping(source = "verificationStatus", target = "verificationStatus")

    SupplierRS mapEntityToRS(SupplierEntity entity);
}