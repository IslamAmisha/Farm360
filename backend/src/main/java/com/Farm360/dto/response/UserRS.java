package com.Farm360.dto.response;

import com.Farm360.utils.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRS {
    private Long id;
    private String phoneNumber;
    private Role role;
}
