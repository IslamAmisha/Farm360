package com.Farm360.dto.response.supply;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierInvoiceItemRS {

    private String description;
    private Double quantity;
    private Double rate;
    private Double amount;
    private String unit;
}
