package com.Farm360.service.buyer;

import com.Farm360.dto.request.BuyerRegisterRQ;
import com.Farm360.dto.response.BuyerRS;
import com.Farm360.mapper.BuyerMapper;
import com.Farm360.model.*;
import com.Farm360.model.payment.BuyerWallet;
import com.Farm360.repository.*;
import com.Farm360.service.buyer.BuyerService;
import com.Farm360.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class BuyerServiceImpl implements BuyerService {

    @Autowired private UserRepo userRepo;
    @Autowired private BuyerRepo buyerRepo;
    @Autowired private DistrictRepo districtRepo;
    @Autowired private BlockRepo blockRepo;
    @Autowired private CityRepo cityRepo;
    @Autowired private CropRepo cropRepo;
    @Autowired private CropSubCategoriesRepo subRepo;
    @Autowired private BuyerMapper mapper;

    @Override
    public BuyerRS registerBuyer(Long userId, BuyerRegisterRQ rq) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BuyerEntity buyer = new BuyerEntity();
        buyer.setUser(user);
        user.setBuyer(buyer);   // bidirectional fix

        user.setRole(Role.buyer);

        userRepo.save(user);

        buyer.setFullName(rq.getFullName());
        buyer.setAadhaarNo(rq.getAadhaarNo());
        buyer.setAadhaarPhotoUrl(rq.getAadhaarPhotoUrl());

        // Location
        buyer.setDistrict(
                districtRepo.findById(rq.getDistrictId())
                        .orElseThrow(() -> new RuntimeException("Invalid district"))
        );
        buyer.setBlock(
                blockRepo.findById(rq.getBlockId())
                        .orElseThrow(() -> new RuntimeException("Invalid block"))
        );
        buyer.setCity(
                cityRepo.findById(rq.getCityId())
                        .orElseThrow(() -> new RuntimeException("Invalid city"))
        );

        buyer.setVillage(rq.getVillage());
        buyer.setPinCode(rq.getPinCode());

        // Business info
        buyer.setBusinessName(rq.getBusinessName());
        buyer.setBusinessType(rq.getBusinessType());
        buyer.setBusinessScale(rq.getBusinessScale());
        buyer.setPaysTax(rq.isPaysTax());
        buyer.setGstRegistered(rq.isGstRegistered());
        buyer.setHasLicence(rq.isHasLicence());
        buyer.setBusinessAge(rq.getBusinessAge());
        buyer.setWarehouseName(rq.getWarehouseName());
        buyer.setWarehouseLocation(rq.getWarehouseLocation());
        buyer.setAnnualPurchase(rq.getAnnualPurchase());


        buyer.setCrops(
                rq.getCropIds() == null ? List.of() : cropRepo.findAllById(rq.getCropIds())
        );

        buyer.setCropSubcategories(
                rq.getSubcategoryIds() == null ? List.of() : subRepo.findAllById(rq.getSubcategoryIds())
        );


        BuyerWallet wallet = new BuyerWallet();
        wallet.setBuyer(buyer);
        buyer.setWallet(wallet);

        BuyerEntity saved = buyerRepo.save(buyer);


        saved.getCrops().size();
        saved.getCropSubcategories().size();

        return mapper.mapEntityToRS(saved);
    }
}
