package com.Farm360.repository.payment;

import com.Farm360.model.payment.EscrowTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscrowTransactionRepository extends JpaRepository<EscrowTransaction, Long> {
    List<EscrowTransaction> findByBuyerIdOrderByTimestampDesc(Long id);

    List<EscrowTransaction> findByFarmerIdOrderByTimestampDesc(Long id);

    List<EscrowTransaction> findByBuyerUserIdOrderByTimestampDesc(Long id);

    List<EscrowTransaction> findByFarmerUserIdOrderByTimestampDesc(Long id);
}
