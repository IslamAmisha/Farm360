package com.Farm360.repository;

import com.Farm360.model.crop.CropEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CropRepo extends JpaRepository<CropEntity,Long> {
}
