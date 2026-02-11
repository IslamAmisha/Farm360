package com.Farm360.model.agreement;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.AgreementStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "agreements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgreementEntity extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long agreementId;

    @Column(nullable = false, unique = true)
    private Long proposalId;

    @Column(nullable = false)
    private Integer proposalVersion;

    @Column(nullable = false)
    private Long requestId;

    @Column(nullable = false)
    private Long farmerUserId;

    @Column(nullable = false)
    private Long buyerUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgreementStatus status;

    private LocalDateTime signedAt;
    private LocalDateTime completedAt;
    private LocalDateTime terminatedAt;

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String agreementSnapshot;

    @Column(nullable = false)
    private Boolean locked = true;
}
