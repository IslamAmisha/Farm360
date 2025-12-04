package com.Farm360.model;

import com.Farm360.model.audit.AuditTable;
import com.Farm360.utils.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_table")
public class UserEntity extends AuditTable<String> {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(name="Phone_no", nullable = false, length = 10,unique = true)
        private String phoneNumber;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 20)
        private Role role = Role.pending;

        @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
        private FarmerEntity farmer;

        @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
        private BuyerEntity buyer;


}
