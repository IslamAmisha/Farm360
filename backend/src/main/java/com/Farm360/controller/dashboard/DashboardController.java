package com.Farm360.controller.dashboard;

import com.Farm360.dto.response.dashboard.DashboardListRS;
import com.Farm360.service.dashboard.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/buyers")
    public ResponseEntity<DashboardListRS> getBuyers(
            @RequestParam Long farmerUserId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String crop
    ) {
        DashboardListRS rs =
                dashboardService.getAvailableBuyers(farmerUserId, search, crop);

        return ResponseEntity.ok(rs);
    }

    @GetMapping("/farmers")
    public ResponseEntity<DashboardListRS> getFarmers(
            @RequestParam Long buyerUserId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String crop
    ) {
        DashboardListRS rs =
                dashboardService.getAvailableFarmers(buyerUserId, search, crop);

        return ResponseEntity.ok(rs);
    }
}
