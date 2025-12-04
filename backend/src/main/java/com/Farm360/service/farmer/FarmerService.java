package com.Farm360.service.farmer;

import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.response.FarmerRS;
import org.springframework.web.multipart.MultipartFile;

public interface FarmerService {
    FarmerRS register(Long userId, FarmerRegisterRQ rq, MultipartFile landPhoto);

}
