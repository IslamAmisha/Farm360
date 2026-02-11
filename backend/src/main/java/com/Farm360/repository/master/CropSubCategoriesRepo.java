package com.Farm360.repository.master;

import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CropSubCategoriesRepo extends JpaRepository<CropSubCategoriesEntity,Long> {

    List<CropSubCategoriesEntity> findByCropId(Long cropId);

    boolean existsByNameIgnoreCaseAndCrop_Id(String name, Long cropId);

    Optional<CropSubCategoriesEntity>
    findByNameIgnoreCaseAndCrop_Id(String name, Long cropId);
}
