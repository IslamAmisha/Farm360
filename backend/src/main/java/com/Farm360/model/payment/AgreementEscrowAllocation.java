package com.Farm360.model.payment;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.EscrowStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "agreement_escrow_allocation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgreementEscrowAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long agreementId;
    private Long buyerUserId;

    private Double totalAllocated;

    private Double advanceAllocated;
    private Double midAllocated;
    private Double finalAllocated;

    private Double advanceReleased = 0.0;
    private Double midReleased = 0.0;
    private Double finalReleased = 0.0;

    private Double remainingLocked;

    @Enumerated(EnumType.STRING)
    private EscrowStatus status;
}