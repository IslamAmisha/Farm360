package com.Farm360.model.agreement;

import com.Farm360.utils.AgreementStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "agreements",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"proposalId"})
        }
)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AgreementEntity {

    /* ========================
       Primary Key
       ======================== */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ========================
       Linkage (immutable intent)
       ======================== */

    @Column(nullable = false, updatable = false)
    private Long proposalId;

    /**
     * Optional depending on your flow.
     * Kept because your previous version had it.
     */
    @Column(nullable = false, updatable = false)
    private Long requestId;

    @Column(nullable = false, updatable = false)
    private Long buyerId;

    @Column(nullable = false, updatable = false)
    private Long farmerId;

    /* ========================
       Financials
       ======================== */

    /**
     * Total contract / escrow obligation amount.
     * No money movement implied.
     */
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalContractAmount;

    /* ========================
       Lifecycle
       ======================== */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgreementStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    /* ========================
       Factory Method
       ======================== */

    public static AgreementEntity create(
            Long proposalId,
            Long requestId,
            Long buyerId,
            Long farmerId,
            BigDecimal totalContractAmount
    ) {
        AgreementEntity agreement = new AgreementEntity();
        agreement.proposalId = proposalId;
        agreement.requestId = requestId;
        agreement.buyerId = buyerId;
        agreement.farmerId = farmerId;
        agreement.totalContractAmount = totalContractAmount;
        agreement.status = AgreementStatus.ACTIVE;
        agreement.startDate = LocalDateTime.now();
        return agreement;
    }
}
