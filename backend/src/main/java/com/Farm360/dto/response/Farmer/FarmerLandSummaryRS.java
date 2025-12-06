package com.Farm360.dto.response.Farmer;


import com.Farm360.utils.CroppingPattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FarmerLandSummaryRS {

    private Long landId;
    private Double size;
    private CroppingPattern croppingPattern;
    private List<String> crops;
}
