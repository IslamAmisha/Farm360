package com.Farm360.service.supply;

import com.Farm360.model.SupplierEntity;
import com.Farm360.model.supply.SupplyExecutionOrderEntity;
import com.Farm360.repository.supplier.SupplierRepo;
import com.Farm360.repository.supply.SupplyExecutionOrderRepository;
import com.Farm360.service.notification.NotificationService;
import com.Farm360.utils.SupplyStatus;
import com.Farm360.utils.VerificationStatus;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SupplierRoutingServiceImpl implements SupplierRoutingService {

    @Autowired
    private SupplyExecutionOrderRepository orderRepo;
    @Autowired
    private SupplierRepo supplierRepo;
    @Autowired
    private NotificationService notificationService;

    @Override
    public void routeAdvanceSupply(Long orderId) {

        SupplyExecutionOrderEntity order =
                orderRepo.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getSupplierUserId() != null)
            return; // already routed

        SupplierEntity supplier =
                supplierRepo.findFirstBySupplierTypeAndVerificationStatus(
                        order.getSupplierType(),
                        VerificationStatus.VERIFIED
                ).orElseThrow(() ->
                        new RuntimeException("No verified supplier available")
                );

        order.setSupplierUserId(supplier.getUser().getId());
        order.setStatus(SupplyStatus.SUPPLIER_NOTIFIED);

        orderRepo.save(order);


        notificationService.notifySupplier(
                supplier.getUser().getId(),
                "New supply request for Agreement " + order.getAgreementId()
        );
    }
}