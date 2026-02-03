package com.Farm360.model.module.cultivation;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.CultivationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "cultivation_executions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationExecutionEntity extends AuditTable<String>
 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* -------------------- OWNERSHIP -------------------- */

    @Column(nullable = false)
    private Long agreementId;

    @Column(nullable = false)
    private Long farmerId;

    @Column(nullable = false)
    private Long buyerId;

    /* -------------------- TIME WINDOWS -------------------- */

    @Column(nullable = false)
    private LocalDate startWindowFrom;

    @Column(nullable = false)
    private LocalDate startWindowTo;

    @Column(nullable = false)
    private LocalDate expectedCompletionDate;

    @Column(nullable = false)
    private LocalDate hardExpiryDate;

    /* -------------------- LIFECYCLE -------------------- */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CultivationStatus status;

    @Column
    private Instant startedAt;

    @Column
    private Instant declaredCompletedAt;

    @Column
    private Instant completedAt;

    /* -------------------- TRACEABILITY -------------------- */

    @Column
    private Instant lastFarmerActionAt;
}
