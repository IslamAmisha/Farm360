package com.Farm360.controller;

import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.service.farmer.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/farmer")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @PostMapping("/register/{userId}")
    public FarmerRS registerFarmer(@PathVariable Long userId, @RequestBody FarmerRegisterRQ rq) {
        return farmerService.register(userId, rq);
    }
}
