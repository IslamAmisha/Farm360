package com.Farm360.service.notification;


import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    @Override
    public void notifySupplier(Long supplierUserId, String message) {

        log.info("🔔 SUPPLIER [{}] : {}", supplierUserId, message);
    }

    @Override
    public void notifyBuyer(Long buyerUserId, String message) {
        log.info("🔔 BUYER [{}] : {}", buyerUserId, message);
    }

    @Override
    public void notifyFarmer(Long farmerUserId, String message) {
        log.info("🔔 FARMER [{}] : {}", farmerUserId, message);
    }
}