package com.Farm360.controller.supplier;

import com.Farm360.dto.request.supplier.SupplierRegisterRQ;
import com.Farm360.dto.response.supplier.SupplierRS;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.supplier.SupplierVerificationService;
import com.Farm360.service.supplier.profile.SupplierProfileService;
import com.Farm360.service.supplier.register.SupplierService;
import com.Farm360.utils.VerificationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/supplier")
@CrossOrigin("*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private SupplierProfileService supplierProfileService;

    @Autowired
    private SupplierVerificationService verificationService;

    @PostMapping("/register/{userId}")
    public ResponseEntity<SupplierRS> register(
            @PathVariable Long userId,
            @RequestBody SupplierRegisterRQ rq
    ) {
        return ResponseEntity.ok(supplierService.register(userId, rq));
    }

    @PutMapping("/verify/{supplierId}")
    public ResponseEntity<VerificationStatus> verifySupplier(
            @PathVariable Long supplierId
    ) {
        return ResponseEntity.ok(
                verificationService.verifySupplier(supplierId)
        );
    }
}