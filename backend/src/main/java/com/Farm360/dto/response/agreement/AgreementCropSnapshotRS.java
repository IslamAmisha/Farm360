package com.Farm360.dto.response.agreement;

import com.Farm360.utils.SeasonType;
import com.Farm360.utils.UnitType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgreementCropSnapshotRS {

    private Long cropId;
    private String cropName;

    private Long cropSubCategoryId;
    private String cropSubCategoryName;

    private SeasonType season;

    private Double expectedQuantity;
    private UnitType unit;

    private Double landAreaUsed;
}