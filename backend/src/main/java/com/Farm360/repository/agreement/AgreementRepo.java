package com.Farm360.repository.agreement;

import org.springframework.stereotype.Repository;

@Repository
public interface AgreementRepo {
    long countByFarmerId(Long farmerId);
    long countByBuyerId(Long buyerId);

}
