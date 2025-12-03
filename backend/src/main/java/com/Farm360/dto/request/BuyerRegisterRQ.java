package com.Farm360.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BuyerRegisterRQ {

    // Basic
    private String fullName;
    private String aadhaarNo;
    private String aadhaarPhotoUrl;
    private Long districtId;
    private Long blockId;
    private Long cityId;
    private String village;
    private String pinCode;

    // Business
    private String businessName;
    private String businessType;
    private String businessScale;
    private boolean paysTax;
    private boolean gstRegistered;
    private boolean hasLicence;
    private String businessAge;
    private String warehouseName;
    private String warehouseLocation;
    private String annualPurchase;

    // Crop Selections
    private List<Long> cropIds;
    private List<Long> subcategoryIds;
}
