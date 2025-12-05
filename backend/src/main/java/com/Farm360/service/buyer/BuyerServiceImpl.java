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
    private BuyerMapper buyerMapper;

    @Override
    public BuyerRS registerBuyer(Long userId, BuyerRegisterRQ rq) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If user already has buyer → STOP duplicate
        if (user.getBuyer() != null) {
            throw new RuntimeException("User already has a Buyer profile");
        }


        DistrictEntity district = districtRepo.findById(rq.getDistrictId())
                .orElseThrow(() -> new RuntimeException("Invalid district"));

        BlockEntity block = blockRepo.findById(rq.getBlockId())
                .orElseThrow(() -> new RuntimeException("Invalid block"));

        CityEntity city = cityRepo.findById(rq.getCityId())
                .orElseThrow(() -> new RuntimeException("Invalid city"));


        if (!block.getDistrict().getId().equals(district.getId())) {
            throw new RuntimeException("Block does not belong to the selected district");
        }

        if (!city.getBlock().getId().equals(block.getId())) {
            throw new RuntimeException("City does not belong to the selected block");
        }


        BuyerEntity buyer = buyerMapper.mapToEntity(rq);

        // Link to user
        buyer.setUser(user);
        user.setBuyer(buyer);
        user.setRole(Role.buyer);

        // Set master table relations
        buyer.setDistrict(district);
        buyer.setBlock(block);
        buyer.setCity(city);


        if (rq.getCropIds() != null && !rq.getCropIds().isEmpty()) {
            buyer.setCrops(cropRepo.findAllById(rq.getCropIds()));
        }

        if (rq.getSubcategoryIds() != null && !rq.getSubcategoryIds().isEmpty()) {
            buyer.setCropSubcategories(subRepo.findAllById(rq.getSubcategoryIds()));
        }


        BuyerWallet wallet = new BuyerWallet();
        wallet.setBuyer(buyer);
        buyer.setWallet(wallet);


        BuyerEntity saved = buyerRepo.save(buyer);

        // Initialize lazy lists
        saved.getCrops().size();
        saved.getCropSubcategories().size();

        return buyerMapper.mapEntityToRS(saved);
    }
}
