package com.Farm360.service.escrow;

import com.Farm360.utils.EscrowPurpose;
import com.Farm360.utils.FundingStage;

public interface EscrowService {

    // Lock supplier escrow at agreement start
    void lockSupplierEscrow(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            String reference
    );

    // Release supplier payment (ADV / MID / FINAL)
    void releaseToSupplier(
            Long agreementId,
            Long buyerUserId,
            Long supplierUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    );

    // Refund unused supplier escrow
    void refundSupplierEscrow(
            Long agreementId,
            Long buyerUserId,
            Double amount,
            String reference
    );

    // Lock farmer profit at end
    void lockFarmerProfit(
            Long buyerUserId,
            Double amount,
            String reference
    );

    // Release farmer profit (FINAL ONLY)
    void releaseFarmerProfit(
            Long buyerUserId,
            Long farmerUserId,
            Double amount,
            String reference
    );
}