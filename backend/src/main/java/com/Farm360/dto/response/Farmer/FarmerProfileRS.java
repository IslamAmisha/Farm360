package com.Farm360.dto.response.Farmer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class FarmerProfileRS {
    private Long userId;
    private String phone;
    private String role;

    private Long farmerId;
    private String farmerName;

    private String districtName;
    private String blockName;
    private String village;
    private String pinCode;
    private String landPhotoUrl;


    private Double totalLimit;
    private Double availableBalance;
    private Double lockedAmount;

    private List<FarmerLandSummaryRS> lands;
}
