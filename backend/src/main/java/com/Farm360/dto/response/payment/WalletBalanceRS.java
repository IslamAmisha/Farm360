package com.Farm360.dto.response.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class WalletBalanceRS {
    private Double availableBalance;
    private Double lockedAmount;
}
