package com.Farm360.model.payment;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.AdjustmentType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "agreement_escrow_adjustments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgreementEscrowAdjustment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long agreementId;
    private Double adjustmentAmount;

    @Enumerated(EnumType.STRING)
    private AdjustmentType type;

    private String reason;
}