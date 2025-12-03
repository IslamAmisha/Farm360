package com.Farm360.controller;

import com.Farm360.dto.request.BuyerRegisterRQ;
import com.Farm360.dto.response.BuyerRS;
import com.Farm360.service.buyer.BuyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/buyer")
public class BuyerController {

    @Autowired
    private BuyerService buyerService;

    @PostMapping("/register/{userId}")
    public BuyerRS registerBuyer(@PathVariable Long userId, @RequestBody BuyerRegisterRQ rq) {
        return buyerService.registerBuyer(userId, rq);
    }
}
