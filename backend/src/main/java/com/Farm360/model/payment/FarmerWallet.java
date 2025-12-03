package com.Farm360.model.payment;

import com.Farm360.model.FarmerEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "farmer_wallet")
public class FarmerWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double totalLimit = 0.0;

    private Double availableBalance = 0.0;

    private Double lockedAmount = 0.0;

    @OneToOne
    @JoinColumn(name = "farmer_id")
    private FarmerEntity farmer;
}
