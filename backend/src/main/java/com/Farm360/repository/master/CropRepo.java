package com.Farm360.repository.master;

import com.Farm360.model.master.crop.CropEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CropRepo extends JpaRepository<CropEntity,Long> {

    boolean existsByNameIgnoreCase(String name);

    Optional<CropEntity> findByNameIgnoreCase(String name);
}
