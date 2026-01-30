package com.Farm360.dto.response.agreement;

import com.Farm360.utils.ContractModel;
import com.Farm360.utils.DeliveryLocation;
import com.Farm360.utils.LogisticsHandledBy;
import com.Farm360.utils.SeasonType;
import lombok.*;

import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AgreementSnapshotRS {

    private Long proposalId;
    private Integer proposalVersion;

    private Long requestId;
    private Long farmerUserId;
    private Long buyerUserId;

    private Long landId;
    private Double landAreaUsed;

    private ContractModel contractModel;
    private SeasonType season;
    private Integer startYear;
    private Integer endYear;

    private Double pricePerUnit;
    private Double totalContractAmount;
    private Boolean escrowApplicable;
    private Integer advancePercent;
    private Integer midCyclePercent;
    private Integer finalPercent;

    private DeliveryLocation deliveryLocation;
    private String deliveryWindow;
    private LogisticsHandledBy logisticsHandledBy;

    private Boolean inputProvided;
    private Boolean allowCropChangeBetweenSeasons;

    private List<AgreementCropSnapshotRS> crops;

    private String remarks;
}


