package com.Farm360.service.notification;

import com.Farm360.model.notification.NotificationEntity;
import com.Farm360.repository.notification.NotificationRepository;
import com.Farm360.utils.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private FirebasePushService firebasePushService;

    @Override
    public void notifyUser(Long userId, NotificationType type, String title, String message, Long refId) {

        // Save notification history
        NotificationEntity n = NotificationEntity.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .referenceId(refId)
                .readFlag(false)
                .build();

        notificationRepository.save(n);

        //Send realtime push
        firebasePushService.sendPushToUser(userId, title, message, refId);
    }
}