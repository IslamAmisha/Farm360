package com.Farm360.service.buyer.profile;

import com.Farm360.dto.request.Buyer.BuyerProfileUpdateRQ;
import com.Farm360.dto.response.Buyer.BuyerProfileRS;
import com.Farm360.model.*;
import com.Farm360.model.master.crop.CropEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.model.payment.BuyerWallet;
import com.Farm360.repository.UserRepo;
import com.Farm360.repository.buyer.BuyerRepo;
import com.Farm360.repository.master.CropRepo;
import com.Farm360.repository.master.CropSubCategoriesRepo;

import com.Farm360.utils.AnnualPurchase;
import com.Farm360.utils.BusinessAge;
import com.Farm360.utils.BusinessScale;
import com.Farm360.utils.BusinessType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BuyerProfileServiceImpl implements BuyerProfileService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BuyerRepo buyerRepo;

    @Autowired
    private CropRepo cropRepo;

    @Autowired
    private CropSubCategoriesRepo cropSubRepo;


    @Override
    @Transactional(readOnly = true)
    public BuyerProfileRS getProfile(Long userId) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BuyerEntity buyer = buyerRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        BuyerProfileRS rs = new BuyerProfileRS();

        // USER
        rs.setUserId(user.getId());
        rs.setPhone(user.getPhoneNumber());
        rs.setRole(user.getRole().name());

        // BASIC
        rs.setBuyerId(buyer.getId());
        rs.setFullName(buyer.getFullName());
        rs.setAadhaarNo(buyer.getAadhaarNo());
        rs.setAadhaarPhotoUrl(buyer.getAadhaarPhotoUrl());
        rs.setBusinessName(buyer.getBusinessName());

        // BUSINESS
        rs.setBusinessType(buyer.getBusinessType() != null ? buyer.getBusinessType().name() : null);
        rs.setBusinessScale(buyer.getBusinessScale() != null ? buyer.getBusinessScale().name() : null);
        rs.setBusinessAge(buyer.getBusinessAge() != null ? buyer.getBusinessAge().name() : null);
        rs.setPaysTax(buyer.isPaysTax());
        rs.setGstRegistered(buyer.isGstRegistered());
        rs.setHasLicence(buyer.isHasLicence());
        rs.setWarehouseName(buyer.getWarehouseName());
        rs.setWarehouseLocation(buyer.getWarehouseLocation());
        rs.setAnnualPurchase(buyer.getAnnualPurchase() != null ? buyer.getAnnualPurchase().name() : null);

        // ADDRESS
        rs.setDistrictName(buyer.getDistrict().getName());
        rs.setBlockName(buyer.getBlock().getName());
        rs.setCityName(buyer.getCity() != null ? buyer.getCity().getName() : null);
        rs.setVillage(buyer.getVillage());
        rs.setPinCode(buyer.getPinCode());

        // WALLET (ONLY THESE 2 FIELDS)
        BuyerWallet wallet = buyer.getWallet();
        if (wallet != null) {
            rs.setBalance(wallet.getBalance());
            rs.setLockedAmount(wallet.getLockedAmount());
        }

        // CROPS
        if (buyer.getCrops() != null)
            rs.setCrops(buyer.getCrops().stream().map(CropEntity::getName).toList());

        if (buyer.getCropSubcategories() != null)
            rs.setCropSubcategories(buyer.getCropSubcategories().stream()
                    .map(CropSubCategoriesEntity::getName).toList());

        return rs;
    }


    @Override
    public BuyerProfileRS updateProfile(Long userId, BuyerProfileUpdateRQ rq) {

        BuyerEntity buyer = buyerRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        /* BASIC FIELDS */
        if (rq.getFullName() != null)
            buyer.setFullName(rq.getFullName());

        /* BUSINESS FIELDS */
        if (rq.getBusinessName() != null)
            buyer.setBusinessName(rq.getBusinessName());

        if (rq.getBusinessType() != null)
            buyer.setBusinessType(BusinessType.valueOf(rq.getBusinessType().toUpperCase()));

        if (rq.getBusinessScale() != null)
            buyer.setBusinessScale(BusinessScale.valueOf(rq.getBusinessScale().toUpperCase()));

        if (rq.getBusinessAge() != null)
            buyer.setBusinessAge(BusinessAge.valueOf(rq.getBusinessAge().toUpperCase()));

        if (rq.getAnnualPurchase() != null)
            buyer.setAnnualPurchase(AnnualPurchase.valueOf(rq.getAnnualPurchase().toUpperCase()));


        /* SAFE BOOLEAN FIELDS */
        if (rq.getPaysTax() != null)
            buyer.setPaysTax(rq.getPaysTax());

        if (rq.getGstRegistered() != null)
            buyer.setGstRegistered(rq.getGstRegistered());

        if (rq.getHasLicence() != null)
            buyer.setHasLicence(rq.getHasLicence());


        /* WAREHOUSE */
        if (rq.getWarehouseName() != null)
            buyer.setWarehouseName(rq.getWarehouseName());

        if (rq.getWarehouseLocation() != null)
            buyer.setWarehouseLocation(rq.getWarehouseLocation());


        /* CROPS */
        if (rq.getCropIds() != null) {
            List<CropEntity> crops = cropRepo.findAllById(rq.getCropIds());
            buyer.setCrops(crops);
        }

        /* SUBCATEGORIES */
        if (rq.getSubcategoryIds() != null) {
            List<CropSubCategoriesEntity> subs = cropSubRepo.findAllById(rq.getSubcategoryIds());
            buyer.setCropSubcategories(subs);
        }

        buyerRepo.save(buyer);

        return getProfile(userId);
    }

}
