package com.Farm360.repository.notification;

import com.Farm360.model.notification.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {


    long countByUserIdAndReadFlagFalse(Long userId);
}