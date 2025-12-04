package com.Farm360.controller;

import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.service.farmer.FarmerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/farmer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @PostMapping("/register/{userId}")
    public ResponseEntity<FarmerRS> registerFarmer(@PathVariable Long userId, @Valid @RequestBody FarmerRegisterRQ rq) {

        FarmerRS rs = farmerService.register(userId, rq);
        return ResponseEntity.ok(rs);
    }
}

