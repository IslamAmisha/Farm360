package com.Farm360.repository.master;

import com.Farm360.model.master.block.BlockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlockRepo extends JpaRepository<BlockEntity, Long> {
    List<BlockEntity> findByDistrictId(Long districtId);
}
