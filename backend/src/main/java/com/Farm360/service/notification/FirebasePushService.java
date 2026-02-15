package com.Farm360.service.notification;

import com.Farm360.model.notification.UserFcmTokenEntity;
import com.Farm360.repository.notification.UserFcmTokenRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FirebasePushService {

    @Autowired
    private UserFcmTokenRepository tokenRepo;

    public void sendPushToUser(Long userId, String title, String body, Long refId) {

        List<UserFcmTokenEntity> tokens = tokenRepo.findByUserIdAndActiveTrue(userId);

        for (UserFcmTokenEntity t : tokens) {

            Message message = Message.builder()
                    .setToken(t.getToken())
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .putData("referenceId", refId == null ? "" : refId.toString())
                    .putData("screen", "DETAIL")
                    .build();

            try {
                FirebaseMessaging.getInstance().send(message);
            } catch (Exception e) {
                t.setActive(false); // token expired
                tokenRepo.save(t);
            }
        }
    }
}