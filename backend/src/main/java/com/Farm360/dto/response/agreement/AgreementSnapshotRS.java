package com.Farm360.dto.response.agreement;

import com.Farm360.utils.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgreementSnapshotRS {

    private Long proposalId;
    private Integer proposalVersion;
    private Long requestId;

    private Long farmerUserId;
    private String farmerName;
    private String farmerLocation;


    private Long buyerUserId;
    private String buyerName;
    private String buyerBusinessName;
    private String buyerLocation;

    private Long landId;
    private Double landAreaUsed;


    private ContractModel contractModel;
    private SeasonType season;
    private Integer startYear;
    private Integer endYear;

    private Double pricePerUnit;
    private Double totalContractAmount;
    private Integer advancePercent;
    private Integer midCyclePercent;
    private Integer finalPercent;
    private Integer farmerProfitPercent;

    private DeliveryLocation deliveryLocation;
    private String deliveryWindow;
    private LogisticsHandledBy logisticsHandledBy;

    private String remarks;

    private List<AgreementCropSnapshotRS> crops;

    private BillToleranceType billToleranceType;
    private Double            billToleranceValue;
}