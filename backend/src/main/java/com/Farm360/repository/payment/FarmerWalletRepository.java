package com.Farm360.repository.payment;

import com.Farm360.model.payment.FarmerWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerWalletRepository extends JpaRepository<FarmerWallet, Long> {

    Optional<FarmerWallet> findByFarmerId(Long farmerId);

}
