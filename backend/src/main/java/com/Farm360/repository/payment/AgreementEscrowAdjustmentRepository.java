package com.Farm360.repository.payment;

import com.Farm360.model.payment.AgreementEscrowAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgreementEscrowAdjustmentRepository extends JpaRepository<AgreementEscrowAdjustment, Long> {
}