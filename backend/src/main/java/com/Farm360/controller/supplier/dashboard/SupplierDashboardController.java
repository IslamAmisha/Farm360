package com.Farm360.controller.supplier.dashboard;

import com.Farm360.dto.response.supplier.SupplierDashboardRS;
import com.Farm360.service.supplier.dashboard.SupplierDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard/supplier")
public class SupplierDashboardController {

    @Autowired
    private SupplierDashboardService dashboardService;

    @GetMapping("/overview")
    public ResponseEntity<SupplierDashboardRS> overview(
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                dashboardService.getDashboard(userId)
        );
    }

    @GetMapping("/requests")
    public ResponseEntity<?> incomingRequests(
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                dashboardService.getIncomingRequests(userId)
        );
    }

    @GetMapping("/deliveries")
    public ResponseEntity<?> activeDeliveries(
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                dashboardService.getActiveDeliveries(userId)
        );
    }
}