package com.Farm360.model;

import com.Farm360.utils.Role;
import jakarta.persistence.*;

@Entity
public class UserEntity{

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer Id;
        private Long phoneNumber;
        @Enumerated(EnumType.STRING)
        private Role role;

        public UserEntity() {
        }

        public UserEntity(Integer id, Long phoneNumber, Role role) {
            Id = id;
            this.phoneNumber = phoneNumber;
            this.role = role;
        }

        public UserEntity(Long phoneNumber, Role role) {
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
