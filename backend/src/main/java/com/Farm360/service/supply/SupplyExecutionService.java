package com.Farm360.service.supply;

import com.Farm360.dto.request.supply.*;
import com.Farm360.dto.response.supply.SupplyExecutionOrderRS;

import java.util.List;

public interface SupplyExecutionService {


    SupplyExecutionOrderRS createAdvanceSupply(SupplyExecutionCreateRQ rq, Long userId);
    SupplyExecutionOrderRS supplierAccept(Long orderId, Long supplierUserId);
    SupplyExecutionOrderRS uploadSupplierBill(SupplierBillUploadRQ rq, Long supplierUserId);
    SupplyExecutionOrderRS farmerConfirm(FarmerSupplyConfirmRQ rq, Long farmerUserId);
    SupplyExecutionOrderRS buyerConfirm(Long orderId, Long buyerUserId);
    SupplyExecutionOrderRS farmerDispatch(FarmerDispatchRQ rq, Long farmerUserId);
    void autoApproveAndRelease(Long orderId);

    SupplyExecutionOrderRS getOrder(Long orderId);


    List<SupplyExecutionOrderRS> getMyOrders(Long userId, String role);


    List<SupplyExecutionOrderRS> getAvailableOrders(Long supplierUserId);
}