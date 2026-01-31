package com.Farm360.mapper.module.input;

import com.Farm360.dto.request.module.input.InputSupplyProofUploadRQ;
import com.Farm360.dto.response.module.input.InputSupplyProofRS;
import com.Farm360.model.module.input.InputSupplyProofEntity;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InputSupplyProofMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "uploadedAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "attemptNo", ignore = true)
    InputSupplyProofEntity toEntity(InputSupplyProofUploadRQ rq);

    InputSupplyProofRS toRS(InputSupplyProofEntity entity);
}

