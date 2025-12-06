package com.Farm360.repository.land;

import com.Farm360.model.land.LandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LandRepository extends JpaRepository<LandEntity, Long> {

    List<LandEntity> findByFarmerId(Long farmerId);

    Optional<LandEntity> findByIdAndFarmerId(Long id, Long farmerId);

}