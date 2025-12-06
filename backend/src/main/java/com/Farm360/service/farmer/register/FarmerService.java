package com.Farm360.service.farmer.register;

import com.Farm360.dto.request.Farmer.FarmerRegisterRQ;
import com.Farm360.dto.response.Farmer.FarmerRS;
import org.springframework.web.multipart.MultipartFile;

public interface FarmerService {
    FarmerRS register(Long userId, FarmerRegisterRQ rq, MultipartFile landPhoto);

}
