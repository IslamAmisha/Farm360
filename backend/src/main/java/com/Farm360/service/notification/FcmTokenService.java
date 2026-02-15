package com.Farm360.service.notification;

public interface FcmTokenService {
    void registerToken(Long userId, String token, String device);
}
