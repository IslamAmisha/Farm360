package com.Farm360.service.farmer;

import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.response.FarmerRS;

public interface FarmerService {

    FarmerRS register(FarmerRegisterRQ rq);
}
