package com.Farm360.repository;

import com.Farm360.model.master.district.DistrictEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistrictRepo extends JpaRepository<DistrictEntity, Long> {
}
