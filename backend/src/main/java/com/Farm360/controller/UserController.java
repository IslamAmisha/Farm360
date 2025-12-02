package com.Farm360.controller;

import com.Farm360.dto.request.BuyerRegisterRQ;
import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.request.UserRegisterRQ;
import com.Farm360.dto.response.BuyerRS;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.dto.response.GlobalRS;
import com.Farm360.dto.response.UserRS;
import com.Farm360.exception.GlobalException;
import com.Farm360.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("registration")
@Slf4j
public class UserController {


    @Autowired
    private UserService userService;

    @PostMapping("/user")
    public ResponseEntity<GlobalRS> registerUser(
            @Valid @RequestBody UserRegisterRQ rq,
            Errors errors) {

        if (errors.hasErrors()) {
            String message = errors.getAllErrors()
                    .stream()
                    .map(e -> e.getDefaultMessage())
                    .reduce("", (a, b) -> a + " | " + b);
            throw new GlobalException(message, "Failure", "Validation Error");
        }

        UserRS rs = userService.createUser(rq);
        return ResponseEntity.ok(new GlobalRS("User created", "Success", rs));
    }


    @PostMapping("/farmer")
    public ResponseEntity<GlobalRS> registerFarmer(
            @Valid @RequestBody FarmerRegisterRQ rq,
            Errors errors) {

        if (errors.hasErrors()) {
            String message = errors.getAllErrors()
                    .stream()
                    .map(e -> e.getDefaultMessage())
                    .reduce("", (a, b) -> a + " | " + b);
            throw new GlobalException(message, "Failure", "Validation Error");
        }

        FarmerRS rs = userService.registerFarmer(rq);
        return ResponseEntity.ok(new GlobalRS("Farmer registered", "Success", rs));
    }


    @PostMapping("/buyer")
    public ResponseEntity<GlobalRS> registerBuyer(
            @Valid @RequestBody BuyerRegisterRQ rq,
            Errors errors) {

        if (errors.hasErrors()) {
            String message = errors.getAllErrors()
                    .stream()
                    .map(e -> e.getDefaultMessage())
                    .reduce("", (a, b) -> a + " | " + b);
            throw new GlobalException(message, "Failure", "Validation Error");
        }

        BuyerRS rs = userService.registerBuyer(rq);
        return ResponseEntity.ok(new GlobalRS("Buyer registered", "Success", rs));
    }
}
