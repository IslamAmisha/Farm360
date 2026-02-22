package com.Farm360.service.supplier.dashboard;

import com.Farm360.dto.response.supplier.SupplierDashboardRS;
import com.Farm360.dto.response.supply.SupplyExecutionOrderRS;
import com.Farm360.mapper.supply.SupplyExecutionOrderMapper;
import com.Farm360.model.SupplierEntity;
import com.Farm360.model.payment.SupplierWallet;
import com.Farm360.model.supply.SupplyExecutionOrderEntity;
import com.Farm360.repository.payment.SupplierWalletRepository;
import com.Farm360.repository.supplier.SupplierRepo;
import com.Farm360.repository.supply.SupplyExecutionOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierDashboardServiceImpl implements SupplierDashboardService {

    @Autowired
    private SupplyExecutionOrderRepository orderRepo;

    @Autowired
    private SupplierWalletRepository walletRepo;

    @Autowired
    private SupplyExecutionOrderMapper mapper;

    @Autowired
    private SupplierRepo supplierRepo;

    @Override
    public SupplierDashboardRS getDashboard(Long supplierUserId) {

        Long active = orderRepo.countActiveOrders(supplierUserId);
        Long pending = orderRepo.countBillsPendingApproval(supplierUserId);
        Long completed = orderRepo.countCompletedOrders(supplierUserId);

        SupplierWallet wallet =
                walletRepo.findBySupplier_User_Id(supplierUserId)
                        .orElseThrow(() -> new RuntimeException("Wallet not found"));

        return SupplierDashboardRS.builder()
                .activeDeliveries(active == null ? 0 : active)
                .billsPendingApproval(pending == null ? 0 : pending)
                .completedJobs(completed == null ? 0 : completed)
                .walletBalance(wallet.getAvailableBalance() == null ? 0.0 : wallet.getAvailableBalance())
                .build();
    }


    @Override
    public List<SupplyExecutionOrderRS> getIncomingRequests(Long supplierUserId) {

        SupplierEntity supplier = supplierRepo.findByUser_Id(supplierUserId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        List<SupplyExecutionOrderEntity> orders =
                orderRepo.findBroadcastRequestsForSupplierType(
                        supplier.getSupplierType()
                );

        return orders.stream()
                .map(mapper::mapEntityToRS)
                .toList();
    }

    @Override
    public List<SupplyExecutionOrderRS> getActiveDeliveries(Long supplierUserId) {

        List<SupplyExecutionOrderEntity> orders =
                orderRepo.findBySupplierUserId(supplierUserId);

        return orders.stream()
                .map(mapper::mapEntityToRS)
                .toList();
    }
}