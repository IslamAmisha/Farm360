package com.Farm360.model;

import com.Farm360.util.Role;
import jakarta.persistence.*;

@Entity
public class Registration {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer Id;
        private Long phoneNumber;
        @Enumerated(EnumType.STRING)
        private Role role;

        public Registration() {
        }

        public Registration(Integer id, Long phoneNumber, Role role) {
            Id = id;
            this.phoneNumber = phoneNumber;
            this.role = role;
        }

        public Registration(Long phoneNumber, Role role) {
            this.phoneNumber = phoneNumber;
            this.role = role;
        }

        public Integer getId() {
            return Id;
        }

        public void setId(Integer id) {
            Id = id;
        }

        public Long getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(Long phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public Role getRole() {
            return role;
        }

        public void setRole(Role role) {
            this.role = role;
        }


}
