package com.Farm360.dto.response.proposal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalCropRS {

    private Long cropId;
    private Long cropSubCategoryId;

    private String season;

    private Double expectedQuantity;
    private String unit;

    private Double landAreaUsed;
}
