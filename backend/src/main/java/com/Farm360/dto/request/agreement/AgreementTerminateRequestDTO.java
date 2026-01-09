package com.Farm360.dto.request.agreement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AgreementTerminateRequestDTO {

    private String reason; // optional, stored later if needed
}
