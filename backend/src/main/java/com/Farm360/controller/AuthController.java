package com.Farm360.controller;

import com.Farm360.dto.request.LoginRQ;
import com.Farm360.dto.request.OtpSendRQ;
import com.Farm360.dto.request.OtpVerifyRQ;
import com.Farm360.dto.response.LoginRS;
import com.Farm360.dto.response.OtpSendRS;
import com.Farm360.dto.response.OtpVerifyRS;
import com.Farm360.service.auth.AuthService;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/otp/send")
    public ResponseEntity<OtpSendRS> sendOtp(@RequestBody OtpSendRQ rq) {
        return ResponseEntity.ok(authService.sendOtp(rq));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<OtpVerifyRS> verifyOtp(@RequestBody OtpVerifyRQ rq) {
        return ResponseEntity.ok(authService.verifyOtp(rq));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginRS> login(@RequestBody LoginRQ rq) {
        return ResponseEntity.ok(authService.login(rq));
    }

    @GetMapping("/captcha/{phone}")
    public ResponseEntity<String> getCaptcha(@PathVariable String phone) {
        String captcha = RandomString.make(5).toUpperCase();
        authService.saveCaptcha(phone, captcha);
        return ResponseEntity.ok(captcha);
    }



}
