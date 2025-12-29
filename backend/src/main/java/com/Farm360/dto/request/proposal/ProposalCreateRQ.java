package com.Farm360.dto.request.proposal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalCreateRQ {

    private Long proposalId; // null for new, present for edit draft

    private Long requestId;
    private Long receiverUserId;

    private Long landId;
    private Long cropId;
    private Long cropSubCategoryId;

    private String contractModel;   // SEASONAL / ANNUAL / BOTH
    private String season;          // nullable

    private Double expectedQuantity;
    private String unit;            // QUINTAL / TON

    private Double pricePerUnit;
    private String currency;         // INR

    private Boolean escrowApplicable;

    private Integer advancePercent;
    private Integer midCyclePercent;
    private Integer finalPercent;

    private Boolean inputProvided;

    private String deliveryLocation; // BUYER_WAREHOUSE / MANDI / FARM_GATE / CUSTOM
    private String deliveryWindow;

    private String logisticsHandledBy; // BUYER / FARMER / SHARED

    private Boolean allowCropChangeBetweenSeasons;

    private Integer startYear;
    private Integer endYear;
}