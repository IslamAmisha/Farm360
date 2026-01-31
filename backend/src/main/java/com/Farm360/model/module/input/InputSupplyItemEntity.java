package com.Farm360.model.module.input;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.InputType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "input_supply_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyItemEntity extends AuditTable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private InputSupplyOrderEntity order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InputType inputType;

    private String brandName;
    private String productName;

    private Double quantity;
    private String unit;

    private Double expectedPrice;
}
