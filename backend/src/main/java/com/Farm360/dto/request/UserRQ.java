package com.Farm360.dto.request;


import com.Farm360.utils.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRQ {

    private String phoneNumber;

    private Role role;

}
