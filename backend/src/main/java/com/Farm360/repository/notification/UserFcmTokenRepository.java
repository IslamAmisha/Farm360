package com.Farm360.repository.notification;

import com.Farm360.model.notification.UserFcmTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFcmTokenRepository extends JpaRepository<UserFcmTokenEntity, Long> {

    List<UserFcmTokenEntity> findByUserIdAndActiveTrue(Long userId);

    Optional<UserFcmTokenEntity> findByToken(String token);
}