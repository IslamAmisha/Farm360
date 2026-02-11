package com.Farm360.model.master.items;

import com.Farm360.utils.SupplierType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supply_item_name")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplyItemName {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SupplierType supplierType;

    private String name;

    private Boolean active = true;
}