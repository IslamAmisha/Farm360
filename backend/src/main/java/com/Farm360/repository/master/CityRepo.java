package com.Farm360.repository.master;

import com.Farm360.model.master.city.CityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepo extends JpaRepository<CityEntity,Long> {

    List<CityEntity> findByBlockId(Long blockId);
}
