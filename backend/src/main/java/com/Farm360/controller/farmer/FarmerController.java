package com.Farm360.controller.farmer;

import com.Farm360.dto.request.Farmer.FarmerRegisterRQ;
import com.Farm360.dto.response.Farmer.FarmerRS;
import com.Farm360.service.farmer.register.FarmerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/farmer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @PostMapping(value="/register/{userId}", consumes = "multipart/form-data")
    public ResponseEntity<FarmerRS> registerFarmer( @PathVariable Long userId,
                                                    @RequestPart("data") FarmerRegisterRQ rq, @RequestPart(value = "landPhoto", required = false) MultipartFile landPhoto){

        FarmerRS rs = farmerService.register(userId, rq,landPhoto);
        return ResponseEntity.ok(rs);
    }
}

