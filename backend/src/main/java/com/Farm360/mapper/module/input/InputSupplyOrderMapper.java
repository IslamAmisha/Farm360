package com.Farm360.mapper.module.input;

import com.Farm360.dto.response.module.input.InputSupplyOrderRS;
import com.Farm360.model.module.input.InputSupplyOrderEntity;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        uses = {
                InputSupplyItemMapper.class,
                InputSupplyProofMapper.class
        }
)
public interface InputSupplyOrderMapper {

    @Mapping(target = "orderId", source = "id")
    @Mapping(target = "systemRemark", ignore = true)
    InputSupplyOrderRS toRS(InputSupplyOrderEntity entity);
}

