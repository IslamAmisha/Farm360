package com.Farm360.mapper;

import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.model.FarmerEntity;

public interface FarmerMapper {
    FarmerEntity mapToEntity(FarmerRegisterRQ rq);

    FarmerRS mapEntityToRS(FarmerEntity farmer);
}
