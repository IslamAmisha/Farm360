package com.Farm360.controller;

import com.Farm360.model.UserEntity;
import com.Farm360.repository.UserRepo;
import com.Farm360.security.jwt.JwtUtils;
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

//    @PostMapping("/otp/login")
//    public ResponseEntity<?> loginWithOtp(@RequestBody Map<String, String> body) throws Exception {
//
////        String idToken = body.get("idToken");
////
////        FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);
////
////        String phone = decoded.getPhoneNumber().substring(3);
////
////        UserEntity user = userRepo.findByPhoneNumber(phone)
////                .orElseThrow(() -> new RuntimeException("User not registered"));
////
////        String jwt = jwtUtils.generateToken(user.getPhoneNumber(), user.getRole());
////
////        return ResponseEntity.ok(Map.of(
////                "jwt", jwt,
////                "role", user.getRole(),
////                "phone", phone
////        ));
////    }
}
