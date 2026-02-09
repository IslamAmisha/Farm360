package com.Farm360.dto.request.supplier;

import com.Farm360.utils.SupplierType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplierRegisterRQ {

    private String supplierName;
    private String businessName;

    private Long districtId;
    private Long blockId;
    private Long cityId;
    private String village;
    private String pinCode;

    private SupplierType supplierType;

    private String panNumber;
    private String gstNumber;
    private String bankAccountNo;
}
