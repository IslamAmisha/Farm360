package com.Farm360.mapper;

import com.Farm360.dto.request.BuyerRegisterRQ;
import com.Farm360.dto.response.BuyerRS;
import com.Farm360.model.BuyerEntity;

public interface BuyerMapper {
    BuyerRS mapEntityToRS(BuyerEntity buyer);

    BuyerEntity mapToEntity(BuyerRegisterRQ rq);
}
