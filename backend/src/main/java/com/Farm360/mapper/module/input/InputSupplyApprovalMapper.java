package com.Farm360.mapper.module.input;

import com.Farm360.dto.request.module.input.InputSupplyApprovalRQ;
import com.Farm360.dto.response.module.input.InputSupplyApprovalRS;
import com.Farm360.model.module.input.InputSupplyApprovalEntity;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InputSupplyApprovalMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    InputSupplyApprovalEntity toEntity(InputSupplyApprovalRQ rq);

    @Mapping(target = "approvalId", source = "id")
    InputSupplyApprovalRS toRS(InputSupplyApprovalEntity entity);
}
