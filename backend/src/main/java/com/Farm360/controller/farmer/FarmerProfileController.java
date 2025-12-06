package com.Farm360.controller.farmer;

import com.Farm360.dto.request.Farmer.FarmerProfileUpdateRQ;
import com.Farm360.dto.response.Farmer.FarmerProfileRS;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.farmer.profile.FarmerProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile/farmer")
public class FarmerProfileController {

    @Autowired
    private FarmerProfileService farmerProfileService;
    @GetMapping
    public ResponseEntity<FarmerProfileRS> getProfile(Authentication authentication) {

        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();

        return ResponseEntity.ok(farmerProfileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<FarmerProfileRS> updateProfile(
            Authentication authentication,
            @RequestBody FarmerProfileUpdateRQ rq
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();

        return ResponseEntity.ok(farmerProfileService.updateProfile(userId, rq));
    }
}
