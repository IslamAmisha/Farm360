package com.Farm360.service.escrow;

import com.Farm360.model.SupplierEntity;
import com.Farm360.model.payment.*;
import com.Farm360.repository.farmer.FarmerRepo;
import com.Farm360.repository.payment.*;
import com.Farm360.repository.supplier.SupplierRepo;
import com.Farm360.service.agreement.AgreementEscrowAllocationService;
import com.Farm360.service.notification.NotificationService;
import com.Farm360.utils.AdjustmentType;
import com.Farm360.utils.EscrowPurpose;
import com.Farm360.utils.FundingStage;
import com.Farm360.utils.NotificationType;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Slf4j
@Transactional
public class EscrowServiceImpl implements EscrowService {

    @Autowired private BuyerWalletRepository buyerWalletRepo;
    @Autowired private SupplierWalletRepository supplierWalletRepo;
    @Autowired private FarmerWalletRepository farmerWalletRepo;
    @Autowired private EscrowTransactionRepository escrowTxnRepo;
    @Autowired private SupplierRepo supplierRepo;
    @Autowired private FarmerRepo farmerRepo;
    @Autowired
    private AgreementEscrowAllocationService allocationService;

    @Autowired
    private NotificationService notificationService;



    @Override
    @Transactional
    public void lockSupplierEscrow(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            String reference
    ) {
        BuyerWallet wallet = buyerWalletRepo
                .findByBuyerUserIdForUpdate(buyerUserId)
                .orElseThrow();

        if (wallet.getBalance() < amount)
            throw new RuntimeException("Insufficient balance");

        wallet.setBalance(wallet.getBalance() - amount);
        wallet.setSupplierLocked(wallet.getSupplierLocked() + amount);

        buyerWalletRepo.save(wallet);

        escrowTxnRepo.save(new EscrowTransaction(
                null,
                amount,
                EscrowPurpose.SUPPLIER_ADVANCE, // semantic label only
                "LOCK",
                reference,
                wallet.getBuyer(),
                null,
                null,
                new Date()
        ));
    }

    @Override
    @Transactional
    public void releaseToSupplier(
            Long agreementId,
            Long buyerUserId,
            Long supplierUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    ) {
        BuyerWallet buyerWallet =
                buyerWalletRepo.findByBuyerUserIdForUpdate(buyerUserId)
                        .orElseThrow();

        if (buyerWallet.getSupplierLocked() < amount)
            throw new RuntimeException("Insufficient supplier escrow");

        SupplierEntity supplier =
                supplierRepo.findByUser_Id(supplierUserId)
                        .orElseThrow();

        SupplierWallet supplierWallet =
                supplierWalletRepo.findBySupplier_User_Id(supplierUserId)
                        .orElseThrow();



        buyerWallet.setSupplierLocked(
                buyerWallet.getSupplierLocked() - amount
        );

        supplierWallet.setAvailableBalance(
                supplierWallet.getAvailableBalance() + amount
        );

        buyerWalletRepo.save(buyerWallet);
        supplierWalletRepo.save(supplierWallet);

        AgreementEscrowAllocation allocation =
                allocationService.getByAgreementId(agreementId);

        if (purpose == EscrowPurpose.SUPPLIER_ADVANCE) {
            allocation.setAdvanceReleased(
                    allocation.getAdvanceReleased() + amount
            );
        } else if (purpose == EscrowPurpose.SUPPLIER_MID) {
            allocation.setMidReleased(
                    allocation.getMidReleased() + amount
            );
        } else if (purpose == EscrowPurpose.SUPPLIER_FINAL) {
            allocation.setFinalReleased(
                    allocation.getFinalReleased() + amount
            );
        }
        allocation.setRemainingAgreementEscrow(
                allocation.getRemainingAgreementEscrow() - amount
        );
        allocationService.save(allocation);
        escrowTxnRepo.save(new EscrowTransaction(

                null,
                amount,
                purpose,
                "RELEASE",
                reference,
                buyerWallet.getBuyer(),
                supplier,
                null,
                new Date()
        ));

        notificationService.notifyUser(
                supplierUserId,
                NotificationType.SUPPLIER_PAYMENT_RELEASED,
                "Payment Released",
                "Payment credited to your wallet",
                agreementId
        );

        notificationService.notifyUser(
                buyerWallet.getBuyer().getUser().getId(),
                NotificationType.ESCROW_DEBITED,
                "Escrow Payment Released",
                "Supplier payment released from escrow",
                agreementId
        );
    }

    /* ---------------- REFUND ---------------- */

    @Override
    @Transactional
    public void refundSupplierEscrow(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            String reference
    ) {
        BuyerWallet wallet =
                buyerWalletRepo.findByBuyerUserIdForUpdate(buyerUserId)
                        .orElseThrow();

        if (wallet.getSupplierLocked() < amount)
            throw new RuntimeException("Invalid refund");

        wallet.setSupplierLocked(wallet.getSupplierLocked() - amount);
        wallet.setBalance(wallet.getBalance() + amount);

        buyerWalletRepo.save(wallet);

        escrowTxnRepo.save(new EscrowTransaction(
                null,
                amount,
                EscrowPurpose.REFUND,
                "REFUND",
                reference,
                wallet.getBuyer(),
                null,
                null,
                new Date()
        ));

        notificationService.notifyUser(
                buyerUserId,
                NotificationType.ESCROW_REFUNDED,
                "Escrow Refunded",
                "Unused escrow returned to your wallet",
                agreementId
        );
    }


    @Override
    @Transactional
    public void lockFarmerProfit(
            Long buyerUserId,
            Double amount,
            String reference
    ) {
        BuyerWallet wallet =
                buyerWalletRepo.findByBuyerUserIdForUpdate(buyerUserId)
                        .orElseThrow();

        if (wallet.getBalance() < amount)
            throw new RuntimeException("Insufficient balance for farmer profit");

        wallet.setBalance(wallet.getBalance() - amount);
        wallet.setFarmerProfitLocked(wallet.getFarmerProfitLocked() + amount);

        buyerWalletRepo.save(wallet);

        escrowTxnRepo.save(new EscrowTransaction(
                null,
                amount,
                EscrowPurpose.FARMER_PROFIT,
                "LOCK",
                reference,
                wallet.getBuyer(),
                null,
                null,
                new Date()
        ));
    }

    @Override
    @Transactional
    public void releaseFarmerProfit(
            Long buyerUserId,
            Long farmerUserId,
            Double amount,
            String reference
    ) {
        BuyerWallet buyerWallet =
                buyerWalletRepo.findByBuyerUserIdForUpdate(buyerUserId)
                        .orElseThrow();

        if (buyerWallet.getFarmerProfitLocked() < amount)
            throw new RuntimeException("Invalid farmer profit release");

        FarmerWallet farmerWallet =
                farmerWalletRepo.findByFarmerUserId(farmerUserId)
                        .orElseThrow();

        buyerWallet.setFarmerProfitLocked(
                buyerWallet.getFarmerProfitLocked() - amount
        );

        farmerWallet.setAvailableBalance(
                farmerWallet.getAvailableBalance() + amount
        );

        buyerWalletRepo.save(buyerWallet);
        farmerWalletRepo.save(farmerWallet);

        notificationService.notifyUser(
                farmerUserId,
                NotificationType.FARMER_PAYMENT_RECEIVED,
                "Profit Received",
                "Your farming profit has been credited",
                null
        );

        notificationService.notifyUser(
                buyerUserId,
                NotificationType.AGREEMENT_COMPLETED,
                "Agreement Completed",
                "Contract successfully completed",
                null
        );

        escrowTxnRepo.save(new EscrowTransaction(
                null,
                amount,
                EscrowPurpose.FARMER_PROFIT,
                "RELEASE",
                reference,
                buyerWallet.getBuyer(),
                null,
                farmerWallet.getFarmer(),
                new Date()
        ));
    }

    @Override
    @Transactional
    public void depositToBuyerWallet(Long buyerUserId, Double amount) {

        if (amount == null || amount <= 0)
            throw new RuntimeException("Invalid deposit amount");

        BuyerWallet wallet =
                buyerWalletRepo.findByBuyerUserIdForUpdate(buyerUserId)
                        .orElseThrow(() -> new RuntimeException("Wallet not found"));

        wallet.setBalance(wallet.getBalance() + amount);

        buyerWalletRepo.save(wallet);

        escrowTxnRepo.save(new EscrowTransaction(
                null,
                amount,
                EscrowPurpose.DEPOSIT,
                "DEPOSIT",
                "WALLET_TOPUP",
                wallet.getBuyer(),
                null,
                null,
                new Date()
        ));
    }
}