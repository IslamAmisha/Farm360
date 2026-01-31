package com.Farm360.model.module.input;

import com.Farm360.model.audit.AuditTable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "input_supply_approvals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyApprovalEntity extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private InputSupplyOrderEntity order;

    @Column(nullable = false)
    private Boolean approved;

    @Column(length = 1000)
    private String reason; // mandatory if rejected

}
