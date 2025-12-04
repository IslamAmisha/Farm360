package com.Farm360.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BuyerRS {
    private Long id;
    private String fullName;
    private String businessName;
    private String district;
    private String block;
    private String city;

    private List<String> crops;
    private List<String> cropSubcategories;

}
