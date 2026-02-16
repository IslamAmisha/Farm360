package com.Farm360.service.supply;

import com.Farm360.utils.SupplierType;

import java.util.List;

public interface SupplierBroadcastResolver {

    List<Long> resolveSuppliers(SupplierType supplierType);

}