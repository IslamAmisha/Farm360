package com.Farm360.dto.request.proposal;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalCreateRQ {

    private Long proposalId;

    private Long requestId;
    private Long receiverUserId;
    private String actionRequiredBy;

    private Long landId;
    private Double landAreaUsed;

    private String contractModel;
    private String season;

    private Double pricePerUnit;

    private Boolean escrowApplicable;

    private Integer advancePercent;
    private Integer midCyclePercent;
    private Integer finalPercent;

    private Boolean inputProvided;

    private String deliveryLocation;
    private String deliveryWindow;

    private String logisticsHandledBy;

    private Boolean allowCropChangeBetweenSeasons;

    private Integer startYear;
    private Integer endYear;

    private String remarks;

    private List<ProposalCropCreateRQ> proposalCrops;
}
