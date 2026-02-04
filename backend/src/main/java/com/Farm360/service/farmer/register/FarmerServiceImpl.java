package com.Farm360.service.farmer.register;

import com.Farm360.dto.request.Farmer.FarmerRegisterRQ;
import com.Farm360.dto.response.Farmer.FarmerRS;
import com.Farm360.mapper.FarmerMapper;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.UserEntity;
import com.Farm360.model.land.LandCropEntity;
import com.Farm360.model.land.LandEntity;
import com.Farm360.model.master.block.BlockEntity;
import com.Farm360.model.master.district.DistrictEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.model.payment.FarmerWallet;
import com.Farm360.repository.UserRepo;
import com.Farm360.repository.farmer.FarmerRepo;
import com.Farm360.repository.land.LandCropRepository;
import com.Farm360.repository.land.LandRepository;
import com.Farm360.repository.master.BlockRepo;
import com.Farm360.repository.master.CropRepo;
import com.Farm360.repository.master.CropSubCategoriesRepo;
import com.Farm360.repository.master.DistrictRepo;
import com.Farm360.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;   // ⬅ IMPORTANT
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@Transactional
public class FarmerServiceImpl implements FarmerService {

    @Autowired private UserRepo userRepo;
    @Autowired private FarmerRepo farmerRepo;
    @Autowired private CropRepo cropRepo;
    @Autowired private CropSubCategoriesRepo subCategoryRepo;
    @Autowired private LandRepository landRepository;
    @Autowired private LandCropRepository landCropRepository;
    @Autowired private FarmerMapper farmerMapper;
    @Autowired private DistrictRepo districtRepo;
    @Autowired private BlockRepo blockRepo;

    @Override
    public FarmerRS register(Long userId, FarmerRegisterRQ rq, MultipartFile landPhoto) {

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Invalid userId"));

        if (user.getFarmer() != null) {
            throw new RuntimeException("User already registered as Farmer");
        }

        // MASTER: district & block
        DistrictEntity district = districtRepo.findById(rq.getDistrictId())
                .orElseThrow(() -> new RuntimeException("Invalid district"));

        BlockEntity block = blockRepo.findById(rq.getBlockId())
                .orElseThrow(() -> new RuntimeException("Invalid block"));

        // DTO -> FarmerEntity
        FarmerEntity farmer = farmerMapper.mapToEntity(rq);

        farmer.setDistrict(district);
        farmer.setBlock(block);

        // Farmer's general crops preference (existing)
        farmer.setCrops(
                rq.getCropIds() == null ? List.of()
                        : cropRepo.findAllById(rq.getCropIds())
        );

        farmer.setCropSubcategories(
                rq.getSubCategoryIds() == null ? List.of()
                        : subCategoryRepo.findAllById(rq.getSubCategoryIds())
        );

        // Link user
        farmer.setUser(user);
        user.setFarmer(farmer);

        // PHOTO upload (as you had)
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
        
        // SAVE FARMER FIRST
        FarmerEntity savedFarmer = farmerRepo.save(farmer);

        // SET ROLE
        user.setRole(Role.farmer);
        userRepo.save(user);

        // =========== FIRST LAND CREATION ===========
        if (rq.getLandSize() == null) {
            throw new RuntimeException("Land size is required during registration");
        }

        LandEntity land = LandEntity.builder()
                .farmer(savedFarmer)
                .size(rq.getLandSize())
                .build();

        LandEntity savedLand = landRepository.save(land);

        // =========== LAND CROPS (MULTIPLE) ===========
        if (rq.getSubCategoryIds() == null || rq.getSubCategoryIds().isEmpty()) {
            throw new RuntimeException("At least one crop subcategory is required for the land");
        }

        List<CropSubCategoriesEntity> subCategories =
                subCategoryRepo.findAllById(rq.getSubCategoryIds());

        for (CropSubCategoriesEntity sub : subCategories) {
            LandCropEntity landCrop = LandCropEntity.builder()
                    .land(savedLand)
                    .cropSubCategory(sub)
                    .croppingPattern(rq.getCroppingPattern()) // same pattern for this land
                    .build();

            landCropRepository.save(landCrop);
        }

        // INITIALIZE LAZY COLLECTIONS
        savedFarmer.getCrops().size();
        savedFarmer.getCropSubcategories().size();
        savedFarmer.getLands().size();

        return farmerMapper.mapEntityToRS(savedFarmer);
    }
}
