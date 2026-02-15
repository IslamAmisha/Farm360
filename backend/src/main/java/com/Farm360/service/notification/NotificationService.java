package com.Farm360.service.notification;

import com.Farm360.utils.NotificationType;

public interface NotificationService {

    void notifyUser(Long userId, NotificationType type, String title, String message, Long refId);

}