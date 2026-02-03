package com.Farm360.model.module.cultivation;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.CultivationUpdateType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "cultivation_updates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationUpdateEntity extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* -------------------- RELATIONSHIP -------------------- */

    @Column(nullable = false)
    private Long cultivationExecutionId;

    /* -------------------- UPDATE DETAILS -------------------- */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CultivationUpdateType updateType;

    /**
     * Can store:
     * - file reference ID (photo / document)
     * - short textual note
     * Interpretation is intentionally outside this module.
     */
    @Column(columnDefinition = "TEXT")
    private String contentRef;

    /* -------------------- TRACEABILITY -------------------- */

    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
