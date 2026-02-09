package com.Farm360.dto.response.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WalletBalanceRS {

    private Double balance;

    private Double supplierLocked;

    private Double farmerProfitLocked;
}