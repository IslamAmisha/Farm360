package com.Farm360.controller.buyer;

import com.Farm360.dto.request.Buyer.BuyerRegisterRQ;
import com.Farm360.dto.response.Buyer.BuyerRS;
import com.Farm360.service.buyer.register.BuyerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/buyer")
@CrossOrigin(origins = "*")
public class BuyerController {

    @Autowired
    private BuyerService buyerService;

    @PostMapping("/register/{userId}")
    public ResponseEntity<BuyerRS> registerBuyer(@PathVariable Long userId, @Valid @RequestBody BuyerRegisterRQ rq) {

        BuyerRS rs = buyerService.registerBuyer(userId, rq);
        return ResponseEntity.ok(rs);
    }
}



