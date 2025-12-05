package com.Farm360.dto.request;

import com.Farm360.utils.*;
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
    private BusinessType businessType;
    private BusinessScale businessScale;
    private List<GovernmentApprovals> governmentApprovals;
    private BusinessAge businessAge;
    private String warehouseName;
    private String warehouseLocation;
    private AnnualPurchase annualPurchase;

    // Crop Selections
    private List<Long> cropIds;
    private List<Long> subcategoryIds;
}
