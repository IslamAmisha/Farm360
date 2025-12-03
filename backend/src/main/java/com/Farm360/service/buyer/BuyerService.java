package com.Farm360.service.buyer;

import com.Farm360.dto.request.BuyerRegisterRQ;
import com.Farm360.dto.response.BuyerRS;

public interface BuyerService {
    BuyerRS registerBuyer(Long userId, BuyerRegisterRQ rq);
}
