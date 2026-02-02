package com.Farm360.model.payment;

import com.Farm360.model.BuyerEntity;
import com.Farm360.model.FarmerEntity;
import com.Farm360.utils.EscrowPurpose;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "escrow_transactions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EscrowTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

//    private String type; // BUYER_TO_FARMER, FARMER_TO_VENDOR, REFUND

    @Enumerated(EnumType.STRING)
    private EscrowPurpose purpose;

    private String action;

    private String reference;

//    private String description;

    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private BuyerEntity buyer;

    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private FarmerEntity farmer;

    private Date timestamp;
}
