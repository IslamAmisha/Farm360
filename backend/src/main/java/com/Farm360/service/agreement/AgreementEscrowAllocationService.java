package com.Farm360.service.agreement;

import com.Farm360.model.payment.AgreementEscrowAllocation;
import com.Farm360.repository.payment.AgreementEscrowAllocationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class AgreementEscrowAllocationService {

    @Autowired
    private AgreementEscrowAllocationRepository repo;

    public AgreementEscrowAllocation getByAgreementId(Long agreementId) {
        return repo.findByAgreementId(agreementId)
                .orElseThrow(() -> new RuntimeException("Allocation not found"));
    }

    public AgreementEscrowAllocation save(AgreementEscrowAllocation allocation) {
        return repo.save(allocation);
    }
}