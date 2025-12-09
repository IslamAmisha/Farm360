package com.Farm360.dto.request.Buyer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BuyerProfileUpdateRQ {


    private String fullName;


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
    private String contractModel;
    private List<String> seasons;



    private List<Long> cropIds;
    private List<Long> subcategoryIds;
}
