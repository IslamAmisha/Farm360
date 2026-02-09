package com.Farm360.model.payment;

import com.Farm360.model.SupplierEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "supplier_wallet")
public class SupplierWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double availableBalance = 0.0;

    @OneToOne
    @JoinColumn(name = "supplier_id")
    private SupplierEntity supplier;
}
