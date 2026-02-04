package com.Farm360.repository.farmer;

import com.Farm360.model.FarmerEntity;
import com.Farm360.model.payment.FarmerWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerRepo extends JpaRepository<FarmerEntity,Long> {
    Optional<FarmerEntity> findByUserId(Long userId);

    @Query("select w from FarmerWallet w where w.farmer.user.id = :userId")
    Optional<FarmerWallet> findByFarmerUserId(@Param("userId") Long userId);

}
