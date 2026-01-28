package com.Farm360.model.proposal;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.CoordinationSubject;
import com.Farm360.utils.CoordinationType;
import com.Farm360.utils.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;

@Entity
@Table(name = "proposal_coordination_expectations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProposalCoordinationExpectationEntity
        extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* ---------- RELATION ---------- */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposalId", nullable = false)
    private ProposalEntity proposal;

    /**
     * Snapshot boundary — aligned with ProposalEntity.proposalVersion
     */
    @Column(nullable = false)
    private Integer proposalVersion;

    /* ---------- WHAT ---------- */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CoordinationSubject subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CoordinationType coordinationType;
    // UPDATE / ACKNOWLEDGE / RESPOND

    /* ---------- WHO ---------- */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role actionRequiredBy;
    // BUYER / FARMER

    /* ---------- TIME ---------- */

    @Column(nullable = false)
    private Duration expectedWithin;
    // ISO-8601 duration (PT48H, PT7D, etc.)

    /* ---------- VERSION CONTROL ---------- */

    @Column(nullable = false)
    private Boolean active = true;

    /* ---------- OPTIONAL NOTES ---------- */

    @Column(length = 1000)
    private String note;
}
