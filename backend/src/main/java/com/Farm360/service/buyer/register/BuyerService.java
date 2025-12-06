package com.Farm360.service.buyer.register;

import com.Farm360.dto.request.Buyer.BuyerRegisterRQ;
import com.Farm360.dto.response.Buyer.BuyerRS;

public interface BuyerService {
    BuyerRS registerBuyer(Long userId, BuyerRegisterRQ rq);
}
