package com.Farm360.repository.payment;

import com.Farm360.model.payment.SupplierWallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SupplierWalletRepository extends JpaRepository<SupplierWallet, Long> {

    Optional<SupplierWallet> findBySupplier_User_Id(Long userId);
}
