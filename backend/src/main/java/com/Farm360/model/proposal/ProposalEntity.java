package com.Farm360.model.proposal;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "proposals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalEntity extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long proposalId;

    @Column(nullable = false)
    private Long requestId;

    @Column(nullable = false)
    private Long senderUserId;

    @Column(nullable = false)
    private Long receiverUserId;

    private Long landId;
    private Long cropId;
    private Long cropSubCategoryId;

    @Enumerated(EnumType.STRING)
    private ContractModel contractModel;

    @Enumerated(EnumType.STRING)
    private SeasonType season;

    private Double expectedQuantity;

    @Enumerated(EnumType.STRING)
    private UnitType unit;

    private Double pricePerUnit;
    private String currency;

    private Double totalContractAmount;

    private Boolean escrowApplicable;
    private Integer advancePercent;
    private Integer midCyclePercent;
    private Integer finalPercent;

    private Boolean inputProvided;

    @Enumerated(EnumType.STRING)
    private DeliveryLocation deliveryLocation;

    private String deliveryWindow;

    @Enumerated(EnumType.STRING)
    private LogisticsHandledBy logisticsHandledBy;

    private Boolean allowCropChangeBetweenSeasons;

    private Integer startYear;
    private Integer endYear;

    @Enumerated(EnumType.STRING)
    private ProposalStatus proposalStatus;

    private LocalDateTime validUntil;
}
