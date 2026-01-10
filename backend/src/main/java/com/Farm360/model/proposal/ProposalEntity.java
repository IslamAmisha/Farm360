package com.Farm360.model.proposal;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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

    @Column(nullable = true)
    private Long receiverUserId;

    private Long landId;
    private Long cropId;
    private Long cropSubCategoryId;

    @Column(nullable = true)
    private Double landAreaUsed; // acres or hectares


    @Enumerated(EnumType.STRING)
    private ContractModel contractModel;

    @Enumerated(EnumType.STRING)
    private SeasonType season;

    private Double expectedQuantity;

    @Enumerated(EnumType.STRING)
    private UnitType unit;

    private Double pricePerUnit;

    private Double totalContractAmount;

    private Boolean escrowApplicable;
    private Integer advancePercent;
    private Integer midCyclePercent;
    private Integer finalPercent;

    private Boolean inputProvided;

    @Enumerated(EnumType.STRING)
    private DeliveryLocation deliveryLocation;

    private String deliveryWindow;

    private Integer proposalVersion;

    @Enumerated(EnumType.STRING)
    private Role createdByRole;

    private Long parentProposalId;

    @Enumerated(EnumType.STRING)
    private LogisticsHandledBy logisticsHandledBy;

    private Boolean allowCropChangeBetweenSeasons;

    private Integer startYear;
    private Integer endYear;

    @Enumerated(EnumType.STRING)
    private ProposalStatus proposalStatus;

    private LocalDateTime validUntil;

    private Boolean locked;

    @Column(length = 1000)
    private String remarks;

    private LocalDateTime acceptedAt;

    private LocalDateTime rejectedAt;

    private LocalDateTime expiredAt;

    @Column(nullable = true)
    private LocalDateTime actionDueAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role actionRequiredBy; // BUYER / FARMER

    @OneToMany(
            mappedBy = "proposal",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<ProposalCropEntity> proposalCrops;

}
