package com.Farm360.service.escrow;

import com.Farm360.utils.EscrowPurpose;

public interface EscrowService {

    void holdFromBuyer(
            Long buyerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    );

    void releaseToFarmer(
            Long buyerUserId,
            Long farmerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    );

    void refundToBuyer(
            Long buyerUserId,
            Double amount,
            EscrowPurpose purpose,
            String reference
    );
}
