package com.Farm360.service.notification;

import com.Farm360.model.notification.UserFcmTokenEntity;
import com.Farm360.repository.notification.UserFcmTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FcmTokenServiceImpl implements FcmTokenService {

    @Autowired
    private UserFcmTokenRepository repo;

    @Override
    public void registerToken(Long userId, String token, String device) {

        repo.findByToken(token).ifPresentOrElse(
                t -> {
                    t.setActive(true);
                    repo.save(t);
                },
                () -> repo.save(
                        UserFcmTokenEntity.builder()
                                .userId(userId)
                                .token(token)
                                .deviceInfo(device)
                                .active(true)
                                .build()
                )
        );
    }
}