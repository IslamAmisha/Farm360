package com.Farm360.dto.response;

import com.Farm360.utils.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OtpVerifyRS {
    private boolean verified;
    private boolean alreadyRegistered;
    private Long userId;
    private Role role;
    private String jwt;
}
