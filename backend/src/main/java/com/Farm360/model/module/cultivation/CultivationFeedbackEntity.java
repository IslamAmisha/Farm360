package com.Farm360.model.module.cultivation;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.CultivationFeedbackType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "cultivation_feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CultivationFeedbackEntity extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* -------------------- RELATIONSHIP -------------------- */

    @Column(nullable = false)
    private Long cultivationExecutionId;

    @Column(nullable = false)
    private Long buyerId;

    /* -------------------- FEEDBACK -------------------- */

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CultivationFeedbackType feedbackType;

    /**
     * Optional message.
     * - COMMENT: usually present
     * - APPROVAL: usually null
     * - QUALITY_CONCERN: short summary
     */
    @Column(columnDefinition = "TEXT")
    private String message;

    /* -------------------- TRACEABILITY -------------------- */

    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
