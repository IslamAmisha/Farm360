package com.Farm360.mapper.module.input;

import com.Farm360.dto.request.module.input.InputSupplyItemCreateRQ;
import com.Farm360.dto.response.module.input.InputSupplyItemRS;
import com.Farm360.model.module.input.InputSupplyItemEntity;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InputSupplyItemMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    InputSupplyItemEntity toEntity(InputSupplyItemCreateRQ rq);

    InputSupplyItemRS toRS(InputSupplyItemEntity entity);
}
