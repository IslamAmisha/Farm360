package com.Farm360.mapper.agreement;

import com.Farm360.dto.response.agreement.AgreementListRS;
import com.Farm360.dto.response.agreement.AgreementRS;
import com.Farm360.model.agreement.AgreementEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface AgreementMapper {

    AgreementRS toRS(AgreementEntity entity);

    @Mapping(target = "counterPartyName", ignore = true)
    @Mapping(target = "counterPartyRole", ignore = true)
    AgreementListRS toListRS(AgreementEntity entity);
}
