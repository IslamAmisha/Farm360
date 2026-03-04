package com.Farm360.mapper.supply;

import com.Farm360.dto.response.supply.SupplyExecutionOrderRS;
import com.Farm360.model.supply.SupplyExecutionOrderEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {  SupplyExecutionItemMapper.class }
)
public interface SupplyExecutionOrderMapper {

    @Mapping(source = "id", target = "orderId")
    @Mapping(source = "stage", target = "stage")
    @Mapping(source = "agreement.agreementId", target = "agreementId")
    @Mapping(source = "items", target = "items")
    SupplyExecutionOrderRS mapEntityToRS(SupplyExecutionOrderEntity entity);
}