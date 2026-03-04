package com.Farm360.controller.buyer;

import com.Farm360.dto.request.Buyer.BuyerProfileUpdateRQ;
import com.Farm360.dto.response.Buyer.BuyerProfileRS;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.buyer.profile.BuyerProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile/buyer")
public class BuyerProfileController {

    @Autowired
    private BuyerProfileService buyerProfileService;

    /** Own profile — identified by JWT token */
    @GetMapping
    public ResponseEntity<BuyerProfileRS> getProfile(Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(buyerProfileService.getProfile(user.getId()));
    }


    @GetMapping("/{userId}")
    public ResponseEntity<BuyerProfileRS> getProfileById(
            @PathVariable Long userId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(buyerProfileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<BuyerProfileRS> updateProfile(
            Authentication authentication,
            @RequestBody BuyerProfileUpdateRQ rq
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(buyerProfileService.updateProfile(user.getId(), rq));
    }
}