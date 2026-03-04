package com.Farm360.controller.supply;

import com.Farm360.dto.request.supply.*;
import com.Farm360.dto.response.supply.SupplyExecutionOrderRS;
import com.Farm360.security.UserDetailsImpl;
import com.Farm360.service.supply.SupplyExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/advance-supply")
public class AdvanceSupplyController {

    @Autowired
    private SupplyExecutionService advanceSupplyService;

    @GetMapping("/{orderId}")
    public ResponseEntity<SupplyExecutionOrderRS> getOrder(
            @PathVariable Long orderId,
            Authentication authentication) {
        return ResponseEntity.ok(advanceSupplyService.getOrder(orderId));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<SupplyExecutionOrderRS>> myOrders(Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(
                advanceSupplyService.getMyOrders(user.getId(), user.getRole().name()));
    }


    @GetMapping("/available")
    public ResponseEntity<List<SupplyExecutionOrderRS>> availableOrders(Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(advanceSupplyService.getAvailableOrders(user.getId()));
    }

    @PostMapping("/create")
    public ResponseEntity<SupplyExecutionOrderRS> createAdvanceSupply(
            @RequestBody SupplyExecutionCreateRQ rq, Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(advanceSupplyService.createAdvanceSupply(rq, user.getId()));
    }

    @PostMapping("/{orderId}/supplier/accept")
    public ResponseEntity<SupplyExecutionOrderRS> supplierAccept(
            @PathVariable Long orderId, Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(advanceSupplyService.supplierAccept(orderId, user.getId()));
    }


    @PostMapping("/supplier/bill")
    public ResponseEntity<SupplyExecutionOrderRS> uploadSupplierBill(
            @RequestBody SupplierBillUploadRQ rq, Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(advanceSupplyService.uploadSupplierBill(rq, user.getId()));
    }

    @PostMapping("/farmer/confirm")
    public ResponseEntity<SupplyExecutionOrderRS> farmerConfirm(
            @RequestBody FarmerSupplyConfirmRQ rq, Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(advanceSupplyService.farmerConfirm(rq, user.getId()));
    }

    @PostMapping("/{orderId}/buyer/confirm")
    public ResponseEntity<SupplyExecutionOrderRS> buyerConfirm(
            @PathVariable Long orderId, Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(advanceSupplyService.buyerConfirm(orderId, user.getId()));
    }

    @PostMapping("/farmer/dispatch")
    public ResponseEntity<SupplyExecutionOrderRS> farmerDispatch(
            @RequestBody FarmerDispatchRQ rq, Authentication authentication) {
        UserDetailsImpl user = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(advanceSupplyService.farmerDispatch(rq, user.getId()));
    }
}