package com.Farm360.model.supply;

import com.Farm360.utils.SupplyItemType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "advance_supply_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplyExecutionItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private SupplyExecutionOrderEntity order;

    @Enumerated(EnumType.STRING)
    private SupplyItemType type;

    private String brandName;
    private String productName;
    private Double quantity;
    private String unit;

    private Double expectedPrice;
}
