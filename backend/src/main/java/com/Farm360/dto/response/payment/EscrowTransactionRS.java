package com.Farm360.dto.response.payment;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class EscrowTransactionRS {
    private Double amount;
    private String purpose;
    private String action;
    private String reference;
    private Date timestamp;
}

