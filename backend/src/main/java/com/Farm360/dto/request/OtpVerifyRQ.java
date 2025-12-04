package com.Farm360.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OtpVerifyRQ {

    private String phone;
    private String sessionId;
    private String otp;
}
