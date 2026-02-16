package com.Farm360.dto.request.supply;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceItemRQ {

    // What is being billed
    private String description;

    private Double quantity;

    private Double rate;


    private String unit;


}