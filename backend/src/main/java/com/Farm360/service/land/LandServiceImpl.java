package com.Farm360.service.land;

import com.Farm360.dto.request.land.LandRQ;
import com.Farm360.dto.request.land.LandUpdateRQ;
import com.Farm360.dto.response.land.LandRS;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.land.LandCropEntity;
import com.Farm360.model.land.LandEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.repository.farmer.FarmerRepo;
import com.Farm360.repository.land.LandRepository;
import com.Farm360.repository.master.CropSubCategoriesRepo;
import com.Farm360.utils.CroppingPattern;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LandServiceImpl implements LandService {

    @Autowired
    private LandRepository landRepository;
    @Autowired
    private FarmerRepo farmerRepository;
    @Autowired
    private CropSubCategoriesRepo subCategoryRepo;

    @Override
    public LandRS createLand(Long farmerId, LandRQ rq) {

        FarmerEntity farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        if (rq.getSubCategoryIds() == null || rq.getSubCategoryIds().isEmpty()) {
            throw new RuntimeException("At least one crop subcategory is required");
        }

        LandEntity land = LandEntity.builder()
                .farmer(farmer)
                .size(rq.getSize())
                .build();

        LandEntity savedLand = landRepository.save(land);

        for (Long subId : rq.getSubCategoryIds()) {
            CropSubCategoriesEntity sub = subCategoryRepo.findById(subId)
                    .orElseThrow(() -> new RuntimeException("Invalid subcategory ID " + subId));

            LandCropEntity lc = LandCropEntity.builder()
                    .land(savedLand)
                    .cropSubCategory(sub)
                    .croppingPattern(rq.getCroppingPattern())
                    .build();

            savedLand.getLandCrops().add(lc);
        }

        landRepository.save(savedLand);

        return mapToRS(savedLand);
    }

    @Override
    public List<LandRS> getLandsByFarmer(Long farmerId) {
        return landRepository.findByFarmerId(farmerId)
                .stream()
                .map(this::mapToRS)
                .toList();
    }

    @Override
    public LandRS updateLand(Long farmerId, Long landId, LandUpdateRQ rq) {

        LandEntity land = landRepository.findByIdAndFarmerId(landId, farmerId)
                .orElseThrow(() -> new RuntimeException("Invalid land for this farmer"));

        if (rq.getSize() != null) {
            land.setSize(rq.getSize());
        }

        CroppingPattern existingPattern = land.getLandCrops().stream()
                .findFirst()
                .map(LandCropEntity::getCroppingPattern)
                .orElse(null);

        if (rq.getSubCategoryIds() != null) {
            land.getLandCrops().clear();

            List<CropSubCategoriesEntity> subs =
                    subCategoryRepo.findAllById(rq.getSubCategoryIds());


            for (CropSubCategoriesEntity sub : subs) {
                LandCropEntity lc = LandCropEntity.builder()
                        .land(land)
                        .cropSubCategory(sub)
                        .croppingPattern(existingPattern)
                        .build();
                land.getLandCrops().add(lc);
            }
        }

        landRepository.save(land);

        return mapToRS(land);
    }

    @Override
    public void deleteLand(Long farmerId, Long landId) {
        LandEntity land = landRepository.findByIdAndFarmerId(landId, farmerId)
                .orElseThrow(() -> new RuntimeException("Invalid land"));
        landRepository.delete(land);
    }

    private LandRS mapToRS(LandEntity land) {

        return LandRS.builder()
                .landId(land.getId())
                .size(land.getSize())
                .croppingPattern(
                        land.getLandCrops().stream()
                                .findFirst()
                                .map(lc -> lc.getCroppingPattern())
                                .orElse(null)
                )
                .crops(
                        land.getLandCrops().stream()
                                .collect(Collectors.groupingBy(
                                        lc -> lc.getCropSubCategory().getCrop()
                                ))
                                .entrySet()
                                .stream()
                                .map(entry -> {
                                    var crop = entry.getKey();
                                    var subcats = entry.getValue().stream()
                                            .map(lc -> new LandRS.SubCategoryRS(
                                                    lc.getCropSubCategory().getId(),
                                                    lc.getCropSubCategory().getName()
                                            ))
                                            .toList();

                                    return new LandRS.CropRS(
                                            crop.getId(),
                                            crop.getName(),
                                            subcats
                                    );
                                })
                                .toList()
                )
                .build();
    }

}
