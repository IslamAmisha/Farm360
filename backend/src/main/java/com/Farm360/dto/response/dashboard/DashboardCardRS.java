package com.Farm360.dto.response.dashboard;

import com.Farm360.dto.response.land.LandRS;
import lombok.Data;

import java.util.List;

@Data
public class DashboardCardRS {

    // Common user info
    private Long userId;
    private String name;
    private String district;
    private String villageOrCity;
    private String block;

    private int ratingUp;
    private int ratingDown;

    private List<String> crops;
    private List<String> subcategories;

    // Request status
    private boolean canSendRequest;
    private String requestStatus; // NONE / PENDING / ACCEPTED

    // Masked fields
    private String maskedPhone;
    private String maskedAadhaar;


    // Buyer-specific fields
    private String businessName;
    private String businessType;
    private String businessScale;
    private String businessAge;

    private String annualPurchase;
    private String contractModel;
    private List<String> seasons;

    private String warehouseName;
    private String warehouseLocation;


    // Farmer-specific fields
    private List<LandRS> lands;
    private String pinCode;
}

