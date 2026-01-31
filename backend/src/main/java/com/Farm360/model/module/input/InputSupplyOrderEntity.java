package com.Farm360.model.module.input;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.InputEscrowStatus;
import com.Farm360.utils.InputSupplyStage;
import com.Farm360.utils.InputSupplyStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "input_supply_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyOrderEntity extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long agreementId;

    @Column(nullable = false)
    private Integer proposalVersion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InputSupplyStage stage;

    @Column(nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InputEscrowStatus escrowStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InputSupplyStatus status;

    private LocalDateTime uploadDueAt;
    private LocalDateTime approvalDueAt;

    @Column(nullable = false)
    private Integer attemptCount = 0; // max 2

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<InputSupplyItemEntity> items;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<InputSupplyProofEntity> proofs;

    @Column(length = 2000)
    private String systemRemark;

}
