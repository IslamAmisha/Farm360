package com.Farm360.dto.request.supply;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierBillUploadRQ {

    private Long orderId;

    private Double billAmount;
    private String billNumber;
    private String shopName;

    private String invoiceNumber;
    private Double deliveryCharge;
    private Double totalAmount;


    private LocalDate expectedDeliveryDate;
    private String invoicePhotoUrl;

    private List<InvoiceItemRQ> items;

    // proofs (vehicle / receipt / service photo etc)
    private List<ProofUploadRQ> proofs;
}