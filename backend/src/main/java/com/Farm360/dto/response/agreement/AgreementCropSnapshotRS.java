package com.Farm360.dto.response.agreement;

import com.Farm360.utils.SeasonType;
import com.Farm360.utils.UnitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AgreementCropSnapshotRS {
    private Long cropId;
    private Long cropSubCategoryId;
    private SeasonType season;
    private Double expectedQuantity;
    private UnitType unit;
    private Double landAreaUsed;
}

