package com.Farm360.model;

import com.Farm360.model.UserEntity;
import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.city.CityEntity;
import com.Farm360.model.master.district.DistrictEntity;
import com.Farm360.model.payment.SupplierWallet;
import com.Farm360.utils.SupplierType;
import com.Farm360.utils.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "supplier_table")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String supplierName;
    private String businessName;

    @ManyToOne @JoinColumn(name = "district_id")
    private DistrictEntity district;

    @ManyToOne
    @JoinColumn(name = "block_id")
    private BlockEntity block;

    @ManyToOne
    @JoinColumn(name = "city_id", nullable = true)
    private CityEntity city;
    private String village;
    private String pinCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupplierType supplierType;

    private String panNumber;
    private String gstNumber;
    private String bankAccountNo;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false) private UserEntity user;

    @OneToOne(mappedBy = "supplier", cascade = CascadeType.ALL)
    private SupplierWallet wallet;
}