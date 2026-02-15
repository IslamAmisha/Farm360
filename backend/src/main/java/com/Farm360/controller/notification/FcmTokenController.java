package com.Farm360.controller.notification;

import com.Farm360.dto.request.notification.SaveFcmTokenRQ;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.notification.FcmTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fcm")
public class FcmTokenController {

    @Autowired
    private FcmTokenService service;

    @PostMapping("/register")
    public void saveToken(@RequestBody SaveFcmTokenRQ rq,
                          Authentication auth) {

        UserDetailsImpl user = (UserDetailsImpl) auth.getPrincipal();

        service.registerToken(user.getId(), rq.getToken(), "WEB");
    }
}