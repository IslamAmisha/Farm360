package com.Farm360.repository.payment;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepo {
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentEntity p WHERE p.farmer.id = :farmerId")
    long totalByFarmerId(@Param("farmerId") Long farmerId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PaymentEntity p WHERE p.buyer.id = :buyerId")
    long totalByBuyerId(@Param("buyerId") Long buyerId);

}
