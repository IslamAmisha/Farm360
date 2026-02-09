package com.Farm360.dto.response.supplier;

import com.Farm360.utils.SupplierType;
import com.Farm360.utils.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SupplierRS {

    private Long supplierId;
    private Long userId;

    private String supplierName;
    private String businessName;

    private String districtName;
    private String blockName;
    private String cityName;
    private String village;
    private String pinCode;

    private SupplierType supplierType;
    private VerificationStatus verificationStatus;
}
