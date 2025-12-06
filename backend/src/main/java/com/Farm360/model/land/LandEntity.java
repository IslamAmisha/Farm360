package com.Farm360.model.land;

import com.Farm360.model.FarmerEntity;

import com.Farm360.model.master.crop.CropEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lands_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private FarmerEntity farmer;

    @Column(nullable = false)
    private Double size;

    @OneToMany(mappedBy = "land", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LandCropEntity> landCrops = new ArrayList<>();
}
