package com.Farm360.dto.response.supply;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierInvoiceRS {

    private String invoiceNumber;
    private Double deliveryCharge;
    private Double totalAmount;
    private String invoicePhotoUrl;
    private List<SupplierInvoiceItemRS> items;
}
