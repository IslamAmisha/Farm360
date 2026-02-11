package com.Farm360.service.notification;

public interface NotificationService {

    void notifySupplier(Long supplierUserId, String message);

    void notifyBuyer(Long buyerUserId, String message);

    void notifyFarmer(Long farmerUserId, String message);
}