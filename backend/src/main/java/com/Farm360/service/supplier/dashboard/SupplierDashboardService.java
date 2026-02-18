package com.Farm360.service.supplier.dashboard;


import com.Farm360.dto.response.supplier.SupplierDashboardRS;

public interface SupplierDashboardService {

    SupplierDashboardRS getDashboard(Long supplierUserId);
}