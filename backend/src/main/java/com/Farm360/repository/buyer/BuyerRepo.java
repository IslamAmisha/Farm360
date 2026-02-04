package com.Farm360.repository.buyer;

import com.Farm360.model.BuyerEntity;
import com.Farm360.model.payment.BuyerWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BuyerRepo extends JpaRepository<BuyerEntity,Long> {

    Optional<BuyerEntity> findByUserId(Long userId);

    @Query("select w from BuyerWallet w where w.buyer.user.id = :userId")
    Optional<BuyerWallet> findByBuyerUserId(@Param("userId") Long userId);



}
