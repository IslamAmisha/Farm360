package com.Farm360.mapper.supply;

import com.Farm360.dto.response.supply.SupplyExecutionItemRS;
import com.Farm360.model.supply.SupplyExecutionItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface  SupplyExecutionItemMapper {

    @Mapping(source = "id", target = "itemId")
    SupplyExecutionItemRS mapEntityToRS(SupplyExecutionItemEntity entity);
}