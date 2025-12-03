package com.Farm360.service;

import com.Farm360.dto.request.BuyerRegisterRQ;
import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.request.UserRQ;
import com.Farm360.dto.response.BuyerRS;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.dto.response.UserRS;

public interface UserService {

    UserRS createUser(UserRQ rq);

    UserRS getUserById(Long id);
}
