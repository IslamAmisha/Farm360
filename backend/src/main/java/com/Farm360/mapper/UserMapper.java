package com.Farm360.mapper;
import com.Farm360.dto.request.UserRQ;
import com.Farm360.dto.request.UserRQ;
import com.Farm360.dto.response.UserRS;
import com.Farm360.model.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "farmer", ignore = true)
    @Mapping(target = "buyer", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    @Mapping(target = "modifiedDate", ignore = true)
    UserEntity mapToEntity(UserRQ rq);

//    @Mapping(target = "farmerDetails", ignore = true)
//    @Mapping(target = "buyerDetails", ignore = true)
    UserRS mapEntityToRS(UserEntity entity);

}
