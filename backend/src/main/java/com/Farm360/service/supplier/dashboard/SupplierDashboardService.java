package com.Farm360.service.supplier.dashboard;


import com.Farm360.dto.response.supplier.SupplierDashboardRS;
import com.Farm360.dto.response.supply.SupplyExecutionOrderRS;

import java.util.List;

public interface SupplierDashboardService {

    SupplierDashboardRS getDashboard(Long supplierUserId);

    List<SupplyExecutionOrderRS> getIncomingRequests(Long supplierUserId);

    List<SupplyExecutionOrderRS> getActiveDeliveries(Long supplierUserId);
}