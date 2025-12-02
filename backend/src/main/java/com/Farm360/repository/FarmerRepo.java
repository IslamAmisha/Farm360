package com.Farm360.repository;

import com.Farm360.model.FarmerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FarmerRepo extends JpaRepository<FarmerEntity,Long> {

}
