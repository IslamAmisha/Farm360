package com.Farm360.service.buyer.register;

import com.Farm360.dto.request.Buyer.BuyerRegisterRQ;
import com.Farm360.dto.response.Buyer.BuyerRS;
import com.Farm360.mapper.BuyerMapper;
import com.Farm360.model.BuyerEntity;
import com.Farm360.model.UserEntity;
import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.city.CityEntity;
import com.Farm360.model.master.district.DistrictEntity;
import com.Farm360.model.payment.BuyerWallet;
import com.Farm360.repository.*;
import com.Farm360.repository.buyer.BuyerRepo;
import com.Farm360.repository.master.*;
import com.Farm360.utils.ContractModel;
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

        if (user.getBuyer() != null) {
            throw new RuntimeException("User already registered as Buyer");
        }

        // Fetch master data
        DistrictEntity district = districtRepo.findById(rq.getDistrictId())
                .orElseThrow(() -> new RuntimeException("Invalid district"));

        BlockEntity block = blockRepo.findById(rq.getBlockId())
                .orElseThrow(() -> new RuntimeException("Invalid block"));

        CityEntity city = cityRepo.findById(rq.getCityId())
                .orElseThrow(() -> new RuntimeException("Invalid city"));

        // Validation
        if (!block.getDistrict().getId().equals(district.getId())) {
            throw new RuntimeException("Block does not belong to district");
        }

        if (!city.getBlock().getId().equals(block.getId())) {
            throw new RuntimeException("City does not belong to block");
        }

        // Map DTO → Entity
        BuyerEntity buyer = buyerMapper.mapToEntity(rq);

        // Set master relations
        buyer.setDistrict(district);
        buyer.setBlock(block);
        buyer.setCity(city);

        // Contract model + seasons validation
        if (rq.getContractModel() == ContractModel.SEASONAL ||
                rq.getContractModel() == ContractModel.BOTH) {

            if (rq.getSeasons() == null || rq.getSeasons().isEmpty()) {
                throw new RuntimeException("Please select at least one season for Seasonal/Both contract model.");
            }

        } else {
            rq.setSeasons(null); // IGNORE seasons for ANNUAL
        }

        buyer.setContractModel(rq.getContractModel());
        buyer.setSeasons(rq.getSeasons());

        // Crop relations
        if (rq.getCropIds() != null) {
            buyer.setCrops(cropRepo.findAllById(rq.getCropIds()));
        }

        if (rq.getSubcategoryIds() != null) {
            buyer.setCropSubcategories(subRepo.findAllById(rq.getSubcategoryIds()));
        }

        // Link user
        buyer.setUser(user);
        user.setBuyer(buyer);


        // SAVE BUYER
        BuyerEntity savedBuyer = buyerRepo.save(buyer);

        // UPDATE USER ROLE
        user.setRole(Role.buyer);
        userRepo.save(user);

        // Initialize lazy lists
        savedBuyer.getCrops().size();
        savedBuyer.getCropSubcategories().size();

        return buyerMapper.mapEntityToRS(savedBuyer);
    }
}
