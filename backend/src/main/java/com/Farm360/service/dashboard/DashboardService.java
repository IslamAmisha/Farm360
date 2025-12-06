package com.Farm360.service.dashboard;

import com.Farm360.dto.response.dashboard.DashboardListRS;

public interface DashboardService {

    DashboardListRS getAvailableBuyers(Long farmerUserId, String search, String crop);

    DashboardListRS getAvailableFarmers(Long buyerUserId, String search, String crop);
}

