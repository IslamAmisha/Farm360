package com.Farm360.dto.response.Farmer;

import com.Farm360.utils.CroppingPattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FarmerRS {

    private Long id;
    private String farmerName;
    private String districtName;
    private String blockName;
    private String village;
    private String pinCode;
    private Double landSize;
    private CroppingPattern croppingPattern;

    private List<String> crops;
    private List<String> cropSubcategories;

    private String landPhotoUrl;

    private Long userId;
}
