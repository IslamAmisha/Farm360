package com.Farm360.service.farmer;

import com.Farm360.dto.request.FarmerRegisterRQ;
import com.Farm360.dto.response.FarmerRS;
import com.Farm360.mapper.FarmerMapper;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.UserEntity;
import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.district.DistrictEntity;
import com.Farm360.model.payment.FarmerWallet;
import com.Farm360.repository.*;
import com.Farm360.utils.Role;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
@Service
@Transactional
public class FarmerServiceImpl implements FarmerService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private FarmerRepo farmerRepo;
    @Autowired
    private CropRepo cropRepo;
    @Autowired
    private CropSubCategoriesRepo subCategoryRepo;
    @Autowired
    private FarmerMapper farmerMapper;
    @Autowired
    private DistrictRepo districtRepo;
    @Autowired
    private BlockRepo blockRepo;

    @Override
    public FarmerRS register(Long userId, FarmerRegisterRQ rq, MultipartFile landPhoto) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Invalid userId"));

        if (user.getFarmer() != null) {
            throw new RuntimeException("User already registered as Farmer");
        }

        // Fetch master data
        DistrictEntity district = districtRepo.findById(rq.getDistrictId())
                .orElseThrow(() -> new RuntimeException("Invalid district"));

        BlockEntity block = blockRepo.findById(rq.getBlockId())
                .orElseThrow(() -> new RuntimeException("Invalid block"));

        // Map DTO → Entity
        FarmerEntity farmer = farmerMapper.mapToEntity(rq);

        // Assign district & block BEFORE save
        farmer.setDistrict(district);
        farmer.setBlock(block);

        // Assign crops before save
        farmer.setCrops(
                rq.getCropIds() == null ? List.of() : cropRepo.findAllById(rq.getCropIds())
        );

        farmer.setCropSubcategories(
                rq.getSubCategoryIds() == null ? List.of() : subCategoryRepo.findAllById(rq.getSubCategoryIds())
        );

        // Assign user (bi-directional)
        farmer.setUser(user);
        user.setFarmer(farmer);

        // FILE UPLOAD
        if (landPhoto != null && !landPhoto.isEmpty()) {
            try {
                String uploadDir = "uploads/landPhotos/";
                File folder = new File(uploadDir);
                if (!folder.exists()) folder.mkdirs();

                String fileName = System.currentTimeMillis() + "_" + landPhoto.getOriginalFilename();
                Path path = Paths.get(uploadDir + fileName);

                Files.write(path, landPhoto.getBytes());
                farmer.setLandPhotoUrl("/" + uploadDir + fileName);

            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image");
            }
        }

        // Create Wallet
        FarmerWallet wallet = new FarmerWallet();
        wallet.setFarmer(farmer);
        farmer.setWallet(wallet);

        // SAVE FARMER FIRST
        FarmerEntity savedFarmer = farmerRepo.save(farmer);

        // Update user role AFTER registration
        user.setRole(Role.farmer);
        userRepo.save(user);

        // Initialize lazy fields
        savedFarmer.getCrops().size();
        savedFarmer.getCropSubcategories().size();

        return farmerMapper.mapEntityToRS(savedFarmer);
    }
}
