package com.Farm360.model.payment;

import com.Farm360.model.BuyerEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "buyer_wallet")
public class BuyerWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double balance = 0.0;

    private Double lockedAmount = 0.0;

    @OneToOne
    @JoinColumn(name = "buyer_id")
    private BuyerEntity buyer;
}
