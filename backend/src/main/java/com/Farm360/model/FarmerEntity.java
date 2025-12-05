package com.Farm360.model;


import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.crop.CropEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.model.master.district.DistrictEntity;
import com.Farm360.model.payment.FarmerWallet;
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
@Table(name="farmer_table")
public class FarmerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String farmerName;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private DistrictEntity district;

    @ManyToOne
    @JoinColumn(name = "block_id")
    private BlockEntity block;

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

    private String landPhotoUrl;   // stored filename or full path

    @OneToOne(mappedBy = "farmer", cascade = CascadeType.ALL)
    private FarmerWallet wallet;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
}
