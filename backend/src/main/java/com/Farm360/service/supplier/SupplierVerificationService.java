package com.Farm360.service.supplier;

import com.Farm360.model.SupplierEntity;
import com.Farm360.repository.supplier.SupplierRepo;
import com.Farm360.utils.VerificationStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SupplierVerificationService {

    @Autowired
    private SupplierRepo supplierRepo;

    public VerificationStatus verifySupplier(Long supplierId) {

        SupplierEntity supplier = supplierRepo.findById(supplierId)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        boolean panOk = verifyPan(supplier.getPanNumber());
        boolean gstOk = verifyGst(supplier.getGstNumber());
        boolean bankOk = verifyBank(supplier.getBankAccountNo());

        if (panOk && gstOk && bankOk) {
            supplier.setVerificationStatus(VerificationStatus.VERIFIED);
        } else {
            supplier.setVerificationStatus(VerificationStatus.REJECTED);
        }

        supplierRepo.save(supplier);
        return supplier.getVerificationStatus();
    }


    private boolean verifyPan(String pan) {
        return pan != null && pan.length() == 10;
    }

    private boolean verifyGst(String gst) {
        return gst != null && gst.length() >= 12;
    }

    private boolean verifyBank(String accountNo) {
        return accountNo != null && accountNo.length() >= 9;
    }
}