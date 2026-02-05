package com.Farm360.service.escrow;

import com.Farm360.model.payment.*;
import com.Farm360.repository.payment.AgreementEscrowAdjustmentRepository;
import com.Farm360.repository.payment.BuyerWalletRepository;
import com.Farm360.repository.payment.EscrowTransactionRepository;
import com.Farm360.repository.payment.FarmerWalletRepository;
import com.Farm360.service.agreement.AgreementEscrowAllocationService;
import com.Farm360.utils.AdjustmentType;
import com.Farm360.utils.EscrowPurpose;
import com.Farm360.utils.FundingStage;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Slf4j
@Transactional
public class EscrowServiceImpl implements EscrowService {

    @Autowired
    private BuyerWalletRepository buyerWalletRepo;
    @Autowired
    private FarmerWalletRepository farmerWalletRepo;
    @Autowired
    private EscrowTransactionRepository escrowTxnRepo;
    @Autowired
    private AgreementEscrowAllocationService allocationService;
    @Autowired
    private AgreementEscrowAdjustmentRepository adjustmentRepo;



    @Override
    public void lockForAgreement(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    ) {

        BuyerWallet wallet = buyerWalletRepo
                .findByBuyerUserIdForUpdate(buyerUserId)
                .orElseThrow();

        if (wallet.getBalance() < amount)
            throw new RuntimeException("Insufficient balance");

        AgreementEscrowAllocation allocation =
                allocationService.getByAgreementId(agreementId);

        wallet.setBalance(wallet.getBalance() - amount);
        wallet.setLockedAmount(wallet.getLockedAmount() + amount);

        allocation.setRemainingLocked(
                allocation.getRemainingLocked() + amount
        );

        buyerWalletRepo.save(wallet);
        allocationService.save(allocation);

        escrowTxnRepo.save(new EscrowTransaction(
                null, amount, purpose, "LOCK",
                reference, wallet.getBuyer(), null, new Date()
        ));
    }

    @Override
    public void releaseForAgreement(
            Long agreementId,
            Long buyerUserId,
            Long farmerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    ) {

        BuyerWallet buyerWallet =
                buyerWalletRepo.findByBuyerUserIdForUpdate(buyerUserId)
                        .orElseThrow();

        FarmerWallet farmerWallet =
                farmerWalletRepo.findByFarmerUserId(farmerUserId)
                        .orElseThrow();

        AgreementEscrowAllocation allocation =
                allocationService.getByAgreementId(agreementId);

        if (buyerWallet.getLockedAmount() < amount)
            throw new RuntimeException("Invalid release");

        buyerWallet.setLockedAmount(buyerWallet.getLockedAmount() - amount);
        farmerWallet.setAvailableBalance(
                farmerWallet.getAvailableBalance() + amount
        );

        allocation.setRemainingLocked(
                allocation.getRemainingLocked() - amount
        );

        buyerWalletRepo.save(buyerWallet);
        farmerWalletRepo.save(farmerWallet);
        allocationService.save(allocation);

        escrowTxnRepo.save(new EscrowTransaction(
                null, amount, purpose, "RELEASE",
                reference, buyerWallet.getBuyer(), farmerWallet.getFarmer(), new Date()
        ));
    }

    /* ---------------- REFUND ---------------- */

    @Override
    public void refundForAgreement(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    ) {

        BuyerWallet wallet =
                buyerWalletRepo.findByBuyerUserIdForUpdate(buyerUserId)
                        .orElseThrow();

        AgreementEscrowAllocation allocation =
                allocationService.getByAgreementId(agreementId);

        wallet.setLockedAmount(wallet.getLockedAmount() - amount);
        wallet.setBalance(wallet.getBalance() + amount);

        allocation.setRemainingLocked(
                allocation.getRemainingLocked() - amount
        );

        buyerWalletRepo.save(wallet);
        allocationService.save(allocation);

        escrowTxnRepo.save(new EscrowTransaction(
                null, amount, purpose, "REFUND",
                reference, wallet.getBuyer(), null, new Date()
        ));
    }


    @Override
    public void addExtraFunding(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            FundingStage stage,
            String reason
    ) {

        lockForAgreement(
                agreementId,
                buyerUserId,
                amount,
                EscrowPurpose.ADJUSTMENT,
                "TOPUP_" + agreementId
        );

        AgreementEscrowAllocation allocation =
                allocationService.getByAgreementId(agreementId);

        switch (stage) {
            case ADVANCE -> allocation.setAdvanceAllocated(
                    allocation.getAdvanceAllocated() + amount
            );
            case MID -> allocation.setMidAllocated(
                    allocation.getMidAllocated() + amount
            );
            case FINAL -> allocation.setFinalAllocated(
                    allocation.getFinalAllocated() + amount
            );
        }

        allocation.setTotalAllocated(
                allocation.getTotalAllocated() + amount
        );

        allocationService.save(allocation);

        adjustmentRepo.save(
                AgreementEscrowAdjustment.builder()
                        .agreementId(agreementId)
                        .adjustmentAmount(amount)
                        .type(AdjustmentType.EXTRA_FUNDING)
                        .reason(reason)
                        .build()
        );
    }
}