package com.Farm360.model;

import com.Farm360.model.Payment.EscrowWallet;
import com.Farm360.model.crop.CropEntity;
import com.Farm360.model.cropsubcategories.CropSubCategoriesEntity;
import com.Farm360.utils.CroppingPattern;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FarmerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String farmerName;

    private String district;

    private String block;

    private String village;

    @Column(length = 6)
    private String pinCode;

    private Double landSize;

    @Enumerated(EnumType.STRING)
    private CroppingPattern croppingPattern;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "farmer_crops_map", joinColumns = @JoinColumn(name = "farmer_id"), inverseJoinColumns = @JoinColumn(name = "crop_id"))
    private List<CropEntity> crops;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "farmer_crop_subcategories_map", joinColumns = @JoinColumn(name = "farmer_id"), inverseJoinColumns = @JoinColumn(name = "subcategory_id"))
    private List<CropSubCategoriesEntity> cropSubcategories;

    private String landPhoto;   // stored filename or full path

    @OneToOne(mappedBy = "farmer", cascade = CascadeType.ALL)
    private EscrowWallet wallet;
}
