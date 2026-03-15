package com.Farm360.model.supply;

import com.Farm360.model.agreement.AgreementEntity;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agreement_id")
    private AgreementEntity agreement;

    @Column(nullable = false)
    private Integer proposalVersion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FarmingStage stage;

    private Long supplierUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplierType supplierType;


    @Column(nullable = false)
    private Double allocatedAmount;
    private Double billAmount;
    private Double payableAmount;

    @Column(name = "min_bill_amount")
    private Double minBillAmount;

    @Column(name = "max_bill_amount")
    private Double maxBillAmount;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplyStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EscrowReleaseStatus escrowStatus;

    @Column(name = "delivery_address", length = 500)
    private String deliveryAddress;

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


    private String deliveryPhotoUrl;
    private String farmerBillPhotoUrl;
    private Double farmerEnteredBillAmount;
    private String rejectionReason;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private SupplierInvoice invoice;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SupplyProof> proofs;
}