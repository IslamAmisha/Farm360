package com.Farm360.model.module.input;

import com.Farm360.model.audit.AuditTable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "input_supply_proofs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyProofEntity extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private InputSupplyOrderEntity order;

    @Column(nullable = false)
    private String imageUrl;

    private Double geoLat;
    private Double geoLng;

    @Column(length = 2000)
    private String remarks;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @Column(nullable = false)
    private Integer attemptNo; // 1 or 2
}

