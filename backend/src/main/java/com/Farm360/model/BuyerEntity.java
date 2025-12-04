package com.Farm360.model;

import com.Farm360.model.Payment.BuyerWallet;
import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.city.CityEntity;
import com.Farm360.model.master.district.DistrictEntity;
import com.Farm360.model.master.crop.CropEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.utils.AnnualPurchase;
import com.Farm360.utils.BusinessAge;
import com.Farm360.utils.BusinessScale;
import com.Farm360.utils.BusinessType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "buyer_table")
public class BuyerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String aadhaarNo;

    private String aadhaarPhotoUrl;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private DistrictEntity district;

    @ManyToOne
    @JoinColumn(name = "block_id")
    private BlockEntity block;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private CityEntity city;

    private String village;
    private String pinCode;


    private String businessName;

    @Enumerated(EnumType.STRING)
    private BusinessType businessType;

    @Enumerated(EnumType.STRING)
    private BusinessScale businessScale;

    private boolean paysTax;
    private boolean gstRegistered;
    private boolean hasLicence;

    @Enumerated(EnumType.STRING)
    private BusinessAge businessAge;

    private String warehouseName;

    private String warehouseLocation;

    @Enumerated(EnumType.STRING)
    private AnnualPurchase annualPurchase;

    @ManyToMany
    @JoinTable(
            name = "buyer_crops",
            joinColumns = @JoinColumn(name = "buyer_id"),
            inverseJoinColumns = @JoinColumn(name = "crop_id")
    )
    private List<CropEntity> crops;


    @ManyToMany
    @JoinTable(
            name = "buyer_crop_subcategories",
            joinColumns = @JoinColumn(name = "buyer_id"),
            inverseJoinColumns = @JoinColumn(name = "subcategory_id")
    )
    private List<CropSubCategoriesEntity> cropSubcategories;



    @OneToOne(mappedBy = "buyer", cascade = CascadeType.ALL)
    private BuyerWallet wallet;


    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

}
