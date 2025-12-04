package com.Farm360.controller;

import com.Farm360.dto.request.OtpSendRQ;
import com.Farm360.dto.request.OtpVerifyRQ;
import com.Farm360.dto.response.OtpSendRS;
import com.Farm360.dto.response.OtpVerifyRS;
import com.Farm360.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/otp/send")
    public ResponseEntity<OtpSendRS> sendOtp(@RequestBody OtpSendRQ rq) {
        return ResponseEntity.ok(authService.sendOtp(rq));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<OtpVerifyRS> verifyOtp(@RequestBody OtpVerifyRQ rq) {
        return ResponseEntity.ok(authService.verifyOtp(rq));
    }
}
