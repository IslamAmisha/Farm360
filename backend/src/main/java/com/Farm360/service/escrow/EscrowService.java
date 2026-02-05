package com.Farm360.service.escrow;

import com.Farm360.utils.EscrowPurpose;
import com.Farm360.utils.FundingStage;

public interface EscrowService {

    void lockForAgreement(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    );

    void releaseForAgreement(
            Long agreementId,
            Long buyerUserId,
            Long farmerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    );

    void refundForAgreement(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    );

    void addExtraFunding(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            FundingStage stage,
            String reason
    );
}