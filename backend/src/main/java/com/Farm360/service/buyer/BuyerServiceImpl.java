package com.Farm360.service.buyer;

import com.Farm360.dto.request.BuyerRegisterRQ;
import com.Farm360.dto.response.BuyerRS;
import com.Farm360.mapper.BuyerMapper;
import com.Farm360.model.BuyerEntity;
import com.Farm360.model.UserEntity;
import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.city.CityEntity;
import com.Farm360.model.master.district.DistrictEntity;
import com.Farm360.model.payment.BuyerWallet;
import com.Farm360.repository.*;
import com.Farm360.service.buyer.BuyerService;
import com.Farm360.utils.Role;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class BuyerServiceImpl implements BuyerService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private BuyerRepo buyerRepo;
    @Autowired
    private DistrictRepo districtRepo;
    @Autowired
    private BlockRepo blockRepo;
    @Autowired
    private CityRepo cityRepo;
    @Autowired
    private CropRepo cropRepo;
    @Autowired
    private CropSubCategoriesRepo subRepo;
    @Autowired
    private BuyerMapper mapper;

    @Override
    public BuyerRS registerBuyer(Long userId, BuyerRegisterRQ rq) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        // Fetch master data
        DistrictEntity district = districtRepo.findById(rq.getDistrictId())
                .orElseThrow(() -> new RuntimeException("Invalid district"));

        BlockEntity block = blockRepo.findById(rq.getBlockId())
                .orElseThrow(() -> new RuntimeException("Invalid block"));

        CityEntity city = cityRepo.findById(rq.getCityId())
                .orElseThrow(() -> new RuntimeException("Invalid city"));


        // Validate hierarchy
        if (!block.getDistrict().getId().equals(district.getId())) {
            throw new RuntimeException("Block does not belong to district");
        }

        if (!city.getBlock().getId().equals(block.getId())) {
            throw new RuntimeException("City does not belong to block");
        }


        // Build Buyer Entity
        BuyerEntity buyer = new BuyerEntity();
        buyer.setUser(user);
        user.setBuyer(buyer);

        buyer.setFullName(rq.getFullName());
        buyer.setAadhaarNo(rq.getAadhaarNo());
        buyer.setAadhaarPhotoUrl(rq.getAadhaarPhotoUrl());

        buyer.setDistrict(district);
        buyer.setBlock(block);
        buyer.setCity(city);
        buyer.setVillage(rq.getVillage());
        buyer.setPinCode(rq.getPinCode());

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


        // Crop selections

        if (rq.getCropIds() != null) {
            buyer.setCrops(cropRepo.findAllById(rq.getCropIds()));
        }

        if (rq.getSubcategoryIds() != null) {
            buyer.setCropSubcategories(subRepo.findAllById(rq.getSubcategoryIds()));
        }


        // Create Wallet
        BuyerWallet wallet = new BuyerWallet();
        wallet.setBuyer(buyer);
        buyer.setWallet(wallet);


        // Update role
        user.setRole(Role.buyer);

        // Save buyer (which saves user via FK)
        BuyerEntity saved = buyerRepo.save(buyer);

        // Initialize lazy fields
        saved.getCrops().size();
        saved.getCropSubcategories().size();

        return mapper.mapEntityToRS(saved);
    }
}
