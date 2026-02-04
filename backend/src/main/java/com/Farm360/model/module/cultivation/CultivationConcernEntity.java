package com.Farm360.model.module.cultivation;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.CultivationConcernStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "cultivation_concerns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationConcernEntity extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* -------------------- RELATIONSHIP -------------------- */

    @Column(nullable = false)
    private Long cultivationExecutionId;

       /* -------------------- CONCERN STATE -------------------- */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CultivationConcernStatus status;

    /**
     * Short description of the quality issue as perceived by buyer.
     * This is NOT a judgment — only a recorded concern.
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    /* -------------------- LIFECYCLE -------------------- */

    @Column(nullable = false, updatable = false)
    private Instant raisedAt;

    @Column
    private Instant lastUpdatedAt;

    /**
     * Populated only when concern leaves the cultivation module
     * and is handed off to Problem Section.
     */
    @Column
    private Instant escalatedAt;

    @Column
    private Instant resolvedAt;
}
