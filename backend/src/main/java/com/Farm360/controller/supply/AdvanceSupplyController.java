package com.Farm360.controller.supply;

import com.Farm360.dto.request.supply.FarmerDispatchRQ;
import com.Farm360.dto.request.supply.FarmerSupplyConfirmRQ;
import com.Farm360.dto.request.supply.SupplierBillUploadRQ;
import com.Farm360.dto.request.supply.SupplyExecutionCreateRQ;
import com.Farm360.dto.response.supply.SupplyExecutionOrderRS;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.supply.SupplyExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/advance-supply")
public class AdvanceSupplyController {

    @Autowired
    private SupplyExecutionService advanceSupplyService;

    @PostMapping("/create")
    public SupplyExecutionOrderRS createAdvanceSupply(
            @RequestBody SupplyExecutionCreateRQ rq,
            Authentication authentication
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();

        return advanceSupplyService.createAdvanceSupply(rq, user.getId());
    }


    @PostMapping("/{orderId}/supplier/accept")
    public  SupplyExecutionOrderRS supplierAccept(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();

        return advanceSupplyService.supplierAccept(orderId, user.getId());
    }

    @PostMapping("/supplier/bill")
    public  SupplyExecutionOrderRS uploadSupplierBill(
            @RequestBody SupplierBillUploadRQ rq,
            Authentication authentication
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();

        return advanceSupplyService.uploadSupplierBill(rq, user.getId());
    }


    @PostMapping("/farmer/confirm")
    public  SupplyExecutionOrderRS farmerConfirm(
            @RequestBody FarmerSupplyConfirmRQ rq,
            Authentication authentication
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();

        return advanceSupplyService.farmerConfirm(rq, user.getId());
    }

    @PostMapping("/{orderId}/buyer/confirm")
    public  SupplyExecutionOrderRS buyerConfirm(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();

        return advanceSupplyService.buyerConfirm(orderId, user.getId());
    }

    @PostMapping("/farmer/dispatch")
    public SupplyExecutionOrderRS farmerDispatch(
            @RequestBody FarmerDispatchRQ rq,
            Authentication authentication
    ) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return advanceSupplyService.farmerDispatch(rq, user.getId());
    }
}