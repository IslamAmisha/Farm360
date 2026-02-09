package com.Farm360.service.supplier.register;

import com.Farm360.dto.request.supplier.SupplierRegisterRQ;
import com.Farm360.dto.response.supplier.SupplierRS;

public interface SupplierService {

    SupplierRS register(Long userId, SupplierRegisterRQ rq);

    SupplierRS getProfile(Long userId);
}