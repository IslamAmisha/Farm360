package com.Farm360.controller;

import com.Farm360.model.UserEntity;
import com.Farm360.repository.UserRepo;
import com.Farm360.security.jwt.JwtUtils;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/otp/login")
    public ResponseEntity<?> loginWithOtp(@RequestBody Map<String, String> body) throws Exception {

        String idToken = body.get("idToken");

        FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);

        // Extract UID which contains phone number
        String uid = decoded.getUid();   // → phone:+91XXXXXXXXXX

        // Extract phone
        String phone = uid.replace("phone:", "");  // → +91XXXXXXXXXX

        // Remove +91 prefix
        if (phone.startsWith("+91")) {
            phone = phone.substring(3); // → 10 digit mobile
        }

        // Find user by phone number
        UserEntity user = userRepo.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("User not registered"));

        // Generate JWT for your backend app
        String jwt = jwtUtils.generateJwt(phone, user.getRole());

        return ResponseEntity.ok(Map.of(
                "jwt", jwt,
                "role", user.getRole(),
                "phone", phone
        ));
    }

}
