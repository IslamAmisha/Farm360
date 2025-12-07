package com.Farm360.service.farmer.profile;

import com.Farm360.dto.request.Farmer.FarmerProfileUpdateRQ;
import com.Farm360.dto.response.Farmer.FarmerLandSummaryRS;
import com.Farm360.dto.response.Farmer.FarmerProfileRS;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.UserEntity;
import com.Farm360.model.land.LandEntity;
import com.Farm360.model.land.LandCropEntity;
import com.Farm360.model.payment.FarmerWallet;
import com.Farm360.repository.UserRepo;
import com.Farm360.repository.farmer.FarmerRepo;
import com.Farm360.service.farmer.profile.FarmerProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FarmerProfileServiceImpl implements FarmerProfileService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private FarmerRepo farmerRepo;

    @Override
    @Transactional(readOnly = true)
    public FarmerProfileRS getProfile(Long userId) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FarmerEntity farmer = farmerRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        FarmerProfileRS rs = new FarmerProfileRS();


        rs.setUserId(user.getId());
        rs.setPhone(user.getPhoneNumber());  // adjust if different
        rs.setRole(user.getRole().name());


        rs.setFarmerId(farmer.getId());
        rs.setFarmerName(farmer.getFarmerName());
        rs.setDistrictName(farmer.getDistrict().getName());
        rs.setBlockName(farmer.getBlock().getName());
        rs.setVillage(farmer.getVillage());
        rs.setPinCode(farmer.getPinCode());
        rs.setLandPhotoUrl(farmer.getLandPhotoUrl());


        FarmerWallet wallet = farmer.getWallet();
        if (wallet != null) {
            rs.setTotalLimit(wallet.getTotalLimit());
            rs.setAvailableBalance(wallet.getAvailableBalance());
            rs.setLockedAmount(wallet.getLockedAmount());
        }

        rs.setLands(farmer.getLands().stream()
                        .map(this::mapLand)
                        .toList()
        );

        return rs;
    }

    @Override
    public FarmerProfileRS updateProfile(Long userId, FarmerProfileUpdateRQ rq) {

        FarmerEntity farmer = farmerRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        if (rq.getFarmerName() != null && !rq.getFarmerName().isBlank()) {
            farmer.setFarmerName(rq.getFarmerName());
        }

        if (rq.getLandPhotoUrl() != null) {
            farmer.setLandPhotoUrl(rq.getLandPhotoUrl());
        }

        farmerRepo.save(farmer);

        return getProfile(userId);
    }

    private FarmerLandSummaryRS mapLand(LandEntity land) {
        return FarmerLandSummaryRS.builder()
                .landId(land.getId())
                .size(land.getSize())
                .croppingPattern(
                        land.getLandCrops().isEmpty()
                                ? null
                                : land.getLandCrops().get(0).getCroppingPattern()
                )
                .crops(
                        land.getLandCrops().stream()
                                .map(c -> c.getCropSubCategory().getName())
                                .toList()
                )
                .build();
    }

    
}
