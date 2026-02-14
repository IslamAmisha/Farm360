package com.Farm360.controller.supplier;

import com.Farm360.dto.request.supplier.SupplierProfileUpdateRQ;
import com.Farm360.dto.response.supplier.SupplierRS;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.supplier.profile.SupplierProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/supplier")
public class SupplierProfileController {

    @Autowired
    private SupplierProfileService supplierProfileService;

    @GetMapping("/getProfile")
    public ResponseEntity<SupplierRS> getProfile(Authentication authentication) {

        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();

        return ResponseEntity.ok(
                supplierProfileService.getProfile(userId)
        );
    }

    @PutMapping("/update")
    public ResponseEntity<SupplierRS> updateProfile(
            Authentication authentication,
            @RequestBody SupplierProfileUpdateRQ rq
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        Long userId = user.getId();

        return ResponseEntity.ok(
                supplierProfileService.updateProfile(userId, rq)
        );
    }
}