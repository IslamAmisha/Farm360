package com.Farm360.service.dashboard;

import com.Farm360.dto.response.dashboard.DashboardCardRS;
import com.Farm360.dto.response.dashboard.DashboardListRS;
import com.Farm360.dto.response.land.LandRS;
import com.Farm360.model.BuyerEntity;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.master.crop.CropEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.model.request.RequestEntity;
import com.Farm360.repository.buyer.BuyerRepo;
import com.Farm360.repository.farmer.FarmerRepo;
import com.Farm360.repository.request.RequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private BuyerRepo buyerRepo;
    @Autowired
    private FarmerRepo farmerRepo;
    @Autowired
    private RequestRepo requestRepo;

    @Override
    public DashboardListRS getAvailableBuyers(Long farmerUserId, String search, String crop) {

        List<BuyerEntity> buyers = buyerRepo.findAll();

        DashboardListRS rs = new DashboardListRS();

        rs.setUsers(
                buyers.stream()
                        .filter(b -> filterBuyer(b, search, crop))
                        .map(b -> toBuyerCard(b, farmerUserId))
                        .collect(Collectors.toList())
        );

        return rs;
    }

    @Override
    public DashboardListRS getAvailableFarmers(Long buyerUserId, String search, String crop) {

        List<FarmerEntity> farmers = farmerRepo.findAll();

        DashboardListRS rs = new DashboardListRS();

        rs.setUsers(
                farmers.stream()
                        .filter(f -> filterFarmer(f, search, crop))
                        .map(f -> toFarmerCard(f, buyerUserId))
                        .collect(Collectors.toList())
        );

        return rs;
    }

    private boolean filterBuyer(BuyerEntity b, String search, String crop) {

        if (search != null && !search.isEmpty() &&
                !b.getFullName().toLowerCase().contains(search.toLowerCase())) {
            return false;
        }

        if (crop != null && !crop.equals("All Crops")) {
            boolean has = b.getCrops().stream()
                    .anyMatch(c -> c.getName().equalsIgnoreCase(crop));
            if (!has) return false;
        }

        return true;
    }

    private boolean filterFarmer(FarmerEntity f, String search, String crop) {

        if (search != null && !search.isEmpty() &&
                !f.getFarmerName().toLowerCase().contains(search.toLowerCase())) {
            return false;
        }

        if (crop != null && !crop.equals("All Crops")) {
            boolean has = f.getLands().stream()
                    .flatMap(l -> l.getLandCrops().stream())
                    .anyMatch(lc ->
                            lc.getCropSubCategory()
                                    .getCrop()
                                    .getName()
                                    .equalsIgnoreCase(crop)
                    );
            if (!has) return false;
        }

        return true;
    }


    private DashboardCardRS toBuyerCard(BuyerEntity b, Long farmerUserId) {

        DashboardCardRS card = new DashboardCardRS();

        card.setUserId(b.getUser().getId());
        card.setName(b.getFullName());
        card.setBusinessName(b.getBusinessName());

        // Buyer business fields
        card.setBusinessType(b.getBusinessType() != null ? b.getBusinessType().name() : null);
        card.setBusinessScale(b.getBusinessScale() != null ? b.getBusinessScale().name() : null);
        card.setBusinessAge(b.getBusinessAge() != null ? b.getBusinessAge().name() : null);

        card.setAnnualPurchase(
                b.getAnnualPurchase() != null ? b.getAnnualPurchase().name() : null
        );

        card.setContractModel(
                b.getContractModel() != null ? b.getContractModel().name() : null
        );

        // Seasons
        if (b.getSeasons() != null) {
            card.setSeasons(b.getSeasons().stream().map(Enum::name).toList());
        }

        // Warehouse
        card.setWarehouseName(b.getWarehouseName());
        card.setWarehouseLocation(b.getWarehouseLocation());

        // Location
        card.setDistrict(b.getDistrict().getName());
        card.setVillageOrCity(b.getCity() != null ? b.getCity().getName() : "-");

        // Crops
        card.setCrops(
                b.getCrops().stream().map(CropEntity::getName).toList()
        );

        card.setSubcategories(
                b.getCropSubcategories().stream().map(CropSubCategoriesEntity::getName).toList()
        );

        // Masking
        card.setMaskedPhone(maskPhone(b.getUser().getPhoneNumber()));
        card.setMaskedAadhaar(maskAadhaar(b.getAadhaarNo()));

        // Rating
        card.setRatingUp(0);
        card.setRatingDown(0);

        // Request status
        // -------- REQUEST STATUS LOGIC --------
        var reqOpt = requestRepo.findBySender_IdAndReceiver_Id(
                farmerUserId,
                b.getUser().getId()
        );

        if (reqOpt.isPresent()) {
            card.setCanSendRequest(false);
            card.setRequestStatus(reqOpt.get().getStatus().name());
        } else {
            card.setCanSendRequest(true);
            card.setRequestStatus("NONE");
        }



        return card;
    }



    private DashboardCardRS toFarmerCard(FarmerEntity f, Long buyerUserId) {

        DashboardCardRS card = new DashboardCardRS();

        card.setUserId(f.getUser().getId());
        card.setName(f.getFarmerName());
        card.setDistrict(f.getDistrict().getName());
        card.setVillageOrCity(f.getVillage());

        card.setLands(null);
        card.setPinCode(f.getPinCode());

        // Crops
        card.setCrops(
                f.getCrops().stream().map(CropEntity::getName).toList()
        );

        card.setSubcategories(
                f.getCropSubcategories().stream().map(CropSubCategoriesEntity::getName).toList()
        );

        // Masked phone / Aadhaar
        card.setMaskedPhone(maskPhone(f.getUser().getPhoneNumber()));

        // Rating placeholders
        card.setRatingUp(0);
        card.setRatingDown(0);

        // Request status
        // -------- REQUEST STATUS LOGIC --------
        var reqOpt = requestRepo.findBySender_IdAndReceiver_Id(
                buyerUserId,
                f.getUser().getId()
        );

        if (reqOpt.isPresent()) {
            card.setCanSendRequest(false);
            card.setRequestStatus(reqOpt.get().getStatus().name());
        } else {
            card.setCanSendRequest(true);
            card.setRequestStatus("NONE");
        }



        return card;
    }


    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) return "******";
        return "******" + phone.substring(phone.length() - 4);
    }

    private String maskAadhaar(String aadhaar) {
        if (aadhaar == null || aadhaar.length() < 4) return "************";
        return "********" + aadhaar.substring(aadhaar.length() - 4);
    }

}
