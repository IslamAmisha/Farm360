package com.Farm360.model.land;

import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.utils.CroppingPattern;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "land_crops_map")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandCropEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "land_id", nullable = false)
    private LandEntity land;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_category_id", nullable = false)
    private CropSubCategoriesEntity cropSubCategory;


    @Enumerated(EnumType.STRING)
    private CroppingPattern croppingPattern;
}

