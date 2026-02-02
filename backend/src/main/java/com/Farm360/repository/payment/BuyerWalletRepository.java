package com.Farm360.repository.payment;

import com.Farm360.model.payment.BuyerWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface BuyerWalletRepository extends JpaRepository<BuyerWallet, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select w from BuyerWallet w where w.buyer.id = :buyerId")
    Optional<BuyerWallet> findByBuyerIdForUpdate(@Param("buyerId") Long buyerId);

    Optional<BuyerWallet> findByBuyerId(Long buyerId);
}
