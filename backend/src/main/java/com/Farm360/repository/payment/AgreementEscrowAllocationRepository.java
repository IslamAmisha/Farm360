package com.Farm360.repository.payment;

import com.Farm360.model.payment.AgreementEscrowAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgreementEscrowAllocationRepository extends JpaRepository<AgreementEscrowAllocation, Long> {

    Optional<AgreementEscrowAllocation> findByAgreementId(Long agreementId);
}