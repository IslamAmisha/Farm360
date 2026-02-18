package com.Farm360.controller.supplier.dashboard;

import com.Farm360.dto.response.supplier.SupplierDashboardRS;
import com.Farm360.service.supplier.dashboard.SupplierDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class SupplierDashboardController {

    @Autowired
    private SupplierDashboardService dashboardService;

    @GetMapping("/supplier")
    public ResponseEntity<SupplierDashboardRS> getSupplierDashboard(
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                dashboardService.getDashboard(userId)
        );
    }
}