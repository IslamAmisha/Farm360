package com.Farm360.dto.request.proposal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalCropCreateRQ {

    private Long cropId;
    private Long cropSubCategoryId;

    private String season;

    private Double expectedQuantity;
    private String unit;

    private Double landAreaUsed;
}
