package com.Farm360.dto.response.supplier;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplierDashboardRS {

    private Long activeDeliveries;
    private Long billsPendingApproval;
    private Long completedJobs;

    private Double walletBalance;
}