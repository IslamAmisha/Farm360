package com.Farm360.model.cropsubcategories;

import com.Farm360.model.FarmerEntity;
import com.Farm360.model.crop.CropEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Crop_SubCategory")
public class CropSubCategoriesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "crop_id")
    private CropEntity crop;

    @ManyToMany(mappedBy = "cropSubcategories")
    private List<FarmerEntity> farmers;

}
