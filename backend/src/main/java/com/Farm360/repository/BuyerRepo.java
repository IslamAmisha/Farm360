package com.Farm360.repository;

import com.Farm360.model.BuyerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuyerRepo extends JpaRepository<BuyerEntity,Long> {
}
