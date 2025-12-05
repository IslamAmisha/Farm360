package com.Farm360.model.master.cropsubcategory;

import com.Farm360.model.BuyerEntity;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.master.crop.CropEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "crop_sub_category")
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

    @ManyToMany(mappedBy = "cropSubcategories")
    private List<BuyerEntity> buyers;


}
