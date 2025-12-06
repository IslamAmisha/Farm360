package com.Farm360.service.farmer.profile;

import com.Farm360.dto.request.Farmer.FarmerProfileUpdateRQ;
import com.Farm360.dto.response.Farmer.FarmerProfileRS;

public interface FarmerProfileService {
    FarmerProfileRS getProfile(Long userId);
    FarmerProfileRS updateProfile(Long userId, FarmerProfileUpdateRQ rq);
}
