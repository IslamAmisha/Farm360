package com.Farm360.repository.payment;

import com.Farm360.model.payment.FarmerWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerWalletRepository extends JpaRepository<FarmerWallet, Long> {

    @Query("select w from FarmerWallet w where w.farmer.user.id = :userId")
    Optional<FarmerWallet> findByFarmerUserId(@Param("userId") Long userId);
}

