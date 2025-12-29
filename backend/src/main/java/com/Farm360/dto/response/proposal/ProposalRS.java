package com.Farm360.dto.response.proposal;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalRS {

    private Long proposalId;
    private Long requestId;

    private Long senderUserId;
    private Long receiverUserId;

    private Long landId;
    private Long cropId;
    private Long cropSubCategoryId;

    private String contractModel;
    private String season;

    private Double expectedQuantity;
    private String unit;

    private Double pricePerUnit;
    private String currency;

    private Double totalContractAmount;

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

    private String proposalStatus;

    /* -------- Audit fields -------- */

    private LocalDateTime createdAt;   // from AuditTable.createdDate
    private LocalDateTime updatedAt;   // from AuditTable.modifiedDate
}