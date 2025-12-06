package com.Farm360.repository.land;

import com.Farm360.model.land.LandCropEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LandCropRepository extends JpaRepository<LandCropEntity, Long> {
    List<LandCropEntity> findByLandId(Long landId);
    List<LandCropEntity> findByLandFarmerId(Long farmerId);
}
