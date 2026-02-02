package com.Farm360.service.escrow;

import com.Farm360.model.payment.BuyerWallet;
import com.Farm360.model.payment.EscrowTransaction;
import com.Farm360.model.payment.FarmerWallet;
import com.Farm360.repository.payment.BuyerWalletRepository;
import com.Farm360.repository.payment.EscrowTransactionRepository;
import com.Farm360.repository.payment.FarmerWalletRepository;
import com.Farm360.utils.EscrowPurpose;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Slf4j
public class EscrowServiceImpl implements EscrowService {

    @Autowired
    private BuyerWalletRepository buyerWalletRepo;

    @Autowired
    private EscrowTransactionRepository escrowTxnRepo;

    @Autowired
    private FarmerWalletRepository farmerWalletRepo;

    @Override
    @Transactional
    public void holdFromBuyer(
            Long buyerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    ) {
        BuyerWallet wallet = buyerWalletRepo.findByBuyerId(buyerUserId)
                .orElseThrow(() -> new RuntimeException("Buyer wallet not found"));

        if (wallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient buyer balance");
        }

        wallet.setBalance(wallet.getBalance() - amount);
        wallet.setLockedAmount(wallet.getLockedAmount() + amount);

        buyerWalletRepo.save(wallet);

        escrowTxnRepo.save(
                new EscrowTransaction(
                        null,
                        amount,
                        purpose,
                        "HOLD",
                        reference,
                        wallet.getBuyer(),
                        null,
                        new Date()
                )
        );
    }

    @Override
    @Transactional
    public void releaseToFarmer(
            Long buyerUserId,
            Long farmerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    ) {
        BuyerWallet buyerWallet = buyerWalletRepo.findByBuyerId(buyerUserId)
                .orElseThrow();

        FarmerWallet farmerWallet = farmerWalletRepo.findByFarmerId(farmerUserId)
                .orElseThrow();

        buyerWallet.setLockedAmount(buyerWallet.getLockedAmount() - amount);
        farmerWallet.setAvailableBalance(
                farmerWallet.getAvailableBalance() + amount
        );

        buyerWalletRepo.save(buyerWallet);
        farmerWalletRepo.save(farmerWallet);

        escrowTxnRepo.save(
                new EscrowTransaction(
                        null,
                        amount,
                        purpose,
                        "RELEASE",
                        reference,
                        buyerWallet.getBuyer(),
                        farmerWallet.getFarmer(),
                        new Date()
                )
        );
    }

    @Override
    @Transactional
    public void refundToBuyer(
            Long buyerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    ) {
        BuyerWallet wallet = buyerWalletRepo.findByBuyerId(buyerUserId)
                .orElseThrow();

        wallet.setLockedAmount(wallet.getLockedAmount() - amount);
        wallet.setBalance(wallet.getBalance() + amount);

        buyerWalletRepo.save(wallet);

        escrowTxnRepo.save(
                new EscrowTransaction(
                        null,
                        amount,
                        purpose,
                        "REFUND",
                        reference,
                        wallet.getBuyer(),
                        null,
                        new Date()
                )
        );
    }


}