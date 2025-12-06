package com.Farm360.dto.request.Farmer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FarmerProfileUpdateRQ {

    private String farmerName;
    private String landPhotoUrl;
}
