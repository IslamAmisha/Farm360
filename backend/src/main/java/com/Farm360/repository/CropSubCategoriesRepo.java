package com.Farm360.repository;

import com.Farm360.model.cropsubcategories.CropSubCategoriesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CropSubCategoriesRepo extends JpaRepository<CropSubCategoriesEntity,Long> {
}
