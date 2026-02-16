package com.Farm360.service.supply;

import com.Farm360.dto.request.supply.FarmerDispatchRQ;
import com.Farm360.dto.request.supply.SupplyExecutionCreateRQ;
import com.Farm360.dto.request.supply.FarmerSupplyConfirmRQ;
import com.Farm360.dto.request.supply.SupplierBillUploadRQ;
import com.Farm360.dto.response.supply.SupplyExecutionOrderRS;


public interface  SupplyExecutionService {

     SupplyExecutionOrderRS createAdvanceSupply( SupplyExecutionCreateRQ rq, Long userId);

     SupplyExecutionOrderRS supplierAccept(Long orderId, Long supplierUserId);

     SupplyExecutionOrderRS uploadSupplierBill(SupplierBillUploadRQ rq, Long supplierUserId);

     SupplyExecutionOrderRS farmerConfirm(FarmerSupplyConfirmRQ rq, Long farmerUserId);

    void autoApproveAndRelease(Long orderId);

      SupplyExecutionOrderRS buyerConfirm(Long orderId, Long buyerUserId);

   SupplyExecutionOrderRS farmerDispatch(FarmerDispatchRQ rq, Long farmerUserId);
}