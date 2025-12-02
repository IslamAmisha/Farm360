package com.Farm360.dto.response;

import com.Farm360.utils.Role;
import lombok.Data;

@Data
public class UserRS {
    private Long id;
    private String phoneNumber;
    private Role role;
}
