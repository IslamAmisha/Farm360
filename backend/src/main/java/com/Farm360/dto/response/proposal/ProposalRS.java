package com.Farm360.dto.response.proposal;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalRS {

    private Long proposalId;
    private Long requestId;

    private Long senderUserId;
    private String senderName;
    private String receiverName;
    private String senderRole;

    private Long receiverUserId;

    private Long landId;
    private String landLabel;
    private Double totalLandArea;
    private Double landAreaUsed;

    private String contractModel;
    private String season;

    private Double pricePerUnit;
    private Double totalContractAmount;

    private Boolean escrowApplicable;
    private Integer advancePercent;
    private Integer midCyclePercent;
    private Integer finalPercent;

    private LocalDateTime validUntil;
    private LocalDateTime actionDueAt;

    private Boolean inputProvided;

    private String deliveryLocation;
    private String deliveryWindow;

    private String logisticsHandledBy;

    private Boolean allowCropChangeBetweenSeasons;

    private Integer startYear;
    private Integer endYear;

    private String proposalStatus;
    private Integer proposalVersion;

    private String remarks;
    private String actionRequiredBy;

    private List<ProposalCropRS> proposalCrops;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}