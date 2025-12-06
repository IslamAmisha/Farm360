package com.Farm360.service.buyer.profile;

import com.Farm360.dto.request.Buyer.BuyerProfileUpdateRQ;
import com.Farm360.dto.response.Buyer.BuyerProfileRS;

public interface BuyerProfileService {

    BuyerProfileRS getProfile(Long userId);
    BuyerProfileRS updateProfile(Long userId, BuyerProfileUpdateRQ rq);
}
