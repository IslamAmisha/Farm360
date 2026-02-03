package com.Farm360.service.escrow;

import com.Farm360.model.BuyerEntity;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.payment.BuyerWallet;
import com.Farm360.model.payment.FarmerWallet;
import com.Farm360.repository.buyer.BuyerRepo;
import com.Farm360.repository.farmer.FarmerRepo;
import com.Farm360.repository.payment.BuyerWalletRepository;
import com.Farm360.repository.payment.FarmerWalletRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
 public class WalletBootstrapService {

    @Autowired
    private  BuyerWalletRepository buyerWalletRepo;
    @Autowired
    private FarmerWalletRepository farmerWalletRepo;
    @Autowired
    private BuyerRepo buyerRepo;
    @Autowired
    private FarmerRepo farmerRepo;

    @Transactional
    public void ensureBuyerWallet(Long buyerId) {

        if (buyerWalletRepo.findByBuyerId(buyerId).isPresent()) {
            return;
        }

        BuyerEntity buyer = buyerRepo.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        BuyerWallet wallet = new BuyerWallet();
        wallet.setBuyer(buyer);
        wallet.setBalance(0.0);
        wallet.setLockedAmount(0.0);

        buyerWalletRepo.save(wallet);
    }

    @Transactional
    public void ensureFarmerWallet(Long farmerId) {

        if (farmerWalletRepo.findByFarmerId(farmerId).isPresent()) {
            return;
        }

        FarmerEntity farmer = farmerRepo.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        FarmerWallet wallet = new FarmerWallet();
        wallet.setFarmer(farmer);
        wallet.setAvailableBalance(0.0);
        wallet.setLockedAmount(0.0);
        wallet.setTotalLimit(0.0);

        farmerWalletRepo.save(wallet);
    }
}
