package com.Farm360.model.supply;

import com.Farm360.utils.ProofType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supply_proofs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplyProof {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private SupplyExecutionOrderEntity order;

    @Enumerated(EnumType.STRING)
    private ProofType type;

    private String fileUrl;
    private String metadata;
}