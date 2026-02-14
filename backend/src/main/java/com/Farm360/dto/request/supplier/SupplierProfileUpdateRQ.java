package com.Farm360.dto.request.supplier;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierProfileUpdateRQ {

    private String supplierName;
    private String businessName;
    private String village;
    private String pinCode;
    private String bankAccountNo;
}
