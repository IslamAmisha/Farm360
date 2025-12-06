package com.Farm360.dto.response.Buyer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BuyerProfileRS {

    private Long userId;
    private String phone;
    private String role;


    private Long buyerId;
    private String fullName;
    private String aadhaarNo;
    private String aadhaarPhotoUrl;

    private String businessName;
    private String businessType;
    private String businessScale;
    private String businessAge;
    private Boolean paysTax;
    private Boolean gstRegistered;
    private Boolean hasLicence;
    private String warehouseName;
    private String warehouseLocation;
    private String annualPurchase;


    private String districtName;
    private String blockName;
    private String cityName;
    private String village;
    private String pinCode;


    private Double balance;
    private Double lockedAmount;


    private List<String> crops;
    private List<String> cropSubcategories;
}
