package com.Farm360.security;

import com.Farm360.model.UserEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

public class UserDetailsImpl implements UserDetails {private Long id;
    private String phoneNumber;
    private String role;

    @JsonIgnore
    private String password = "N/A"; // Not used in OTP login

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id,
                           String phoneNumber,
                           String role,
                           Collection<? extends GrantedAuthority> authorities) {

        this.id = id;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.authorities = authorities;
    }

    // Build method to convert UserEntity → UserDetailsImpl
    public static UserDetailsImpl build(UserEntity user) {

        List<GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority(user.getRole().name()));

        return new UserDetailsImpl(
                user.getId(),
                user.getPhoneNumber(),
                user.getRole().name(),
                authorities
        );
    }

    // Spring Security required overrides
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    // Username = phone number
    @Override
    public String getUsername() {
        return phoneNumber;
    }

    @Override
    public String getPassword() {
        return password; // not used
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    // Helps avoid duplicate authentication issues
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserDetailsImpl)) return false;
        UserDetailsImpl that = (UserDetailsImpl) o;
        return Objects.equals(id, that.id);
    }
}
