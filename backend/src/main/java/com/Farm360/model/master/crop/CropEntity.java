package com.Farm360.model.master.crop;

import com.Farm360.model.BuyerEntity;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name= "Crop_Table")
public class CropEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "crop", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CropSubCategoriesEntity> subcategories;

    @ManyToMany(mappedBy = "crops")
    private List<FarmerEntity> farmers;

    @ManyToMany(mappedBy = "crops")
    private List<BuyerEntity> buyers;

}
