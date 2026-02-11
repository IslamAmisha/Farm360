package com.Farm360.dto.request.supply;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierBillUploadRQ {

    private Long orderId;

    private Double billAmount;
    private String billNumber;
    private String shopName;

    private LocalDate expectedDeliveryDate;
}