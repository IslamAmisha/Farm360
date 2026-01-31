package com.Farm360.service.escrow;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EscrowServiceImpl extends EscrowService {

    @Override
    public void holdFromBuyer(Long buyerUserId, Double amount, String reference) {
        log.info("ESCROW HOLD | Buyer={} Amount={} Ref={}", buyerUserId, amount, reference);
    }

    @Override
    public void releaseToFarmer(Long farmerUserId, Double amount) {
        log.info("ESCROW RELEASE | Farmer={} Amount={}", farmerUserId, amount);
    }

    @Override
    public void refundToBuyer(Long buyerUserId, Double amount) {
        log.info("ESCROW REFUND | Buyer={} Amount={}", buyerUserId, amount);
    }
}

