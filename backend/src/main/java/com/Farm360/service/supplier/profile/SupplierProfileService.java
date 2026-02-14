package com.Farm360.service.supplier.profile;

import com.Farm360.dto.request.supplier.SupplierProfileUpdateRQ;
import com.Farm360.dto.response.supplier.SupplierRS;

public interface SupplierProfileService {

    SupplierRS getProfile(Long userId);

    SupplierRS updateProfile(Long userId, SupplierProfileUpdateRQ rq);
}