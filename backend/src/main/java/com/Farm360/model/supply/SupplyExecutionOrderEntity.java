package com.Farm360.model.supply;

import com.Farm360.utils.EscrowReleaseStatus;
import com.Farm360.utils.FarmingStage;
import com.Farm360.utils.SupplierType;
import com.Farm360.utils.SupplyStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "advance_supply_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplyExecutionOrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long agreementId;

    @Column(nullable = false)
    private Integer proposalVersion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FarmingStage stage;


    @Column(nullable = false)
    private Long supplierUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplierType supplierType;


    @Column(nullable = false)
    private Double allocatedAmount;
    private Double billAmount;
    private Double payableAmount;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplyStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EscrowReleaseStatus escrowStatus;

    private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;


    private Integer attemptCount = 0;
    private String systemRemark;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List< SupplyExecutionItemEntity> items;
}