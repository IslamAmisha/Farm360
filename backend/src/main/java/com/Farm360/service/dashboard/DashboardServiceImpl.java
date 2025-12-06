package com.Farm360.service.dashboard;

import com.Farm360.dto.response.dashboard.DashboardCardRS;
import com.Farm360.dto.response.dashboard.DashboardListRS;
import com.Farm360.model.BuyerEntity;
import com.Farm360.model.FarmerEntity;
import com.Farm360.model.master.crop.CropEntity;
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
            boolean has = f.getCrops().stream()
                    .anyMatch(c -> c.getName().equalsIgnoreCase(crop));
            if (!has) return false;
        }

        return true;
    }

    private DashboardCardRS toBuyerCard(BuyerEntity b, Long farmerUserId) {

        DashboardCardRS card = new DashboardCardRS();

        card.setUserId(b.getUser().getId());

        card.setName(b.getFullName());
        card.setBusinessName(b.getBusinessName());

        card.setDistrict(b.getDistrict().getName());
        card.setVillageOrCity(b.getCity() != null ? b.getCity().getName() : "-");

        // Rating placeholders (fields not yet in DB)
        card.setRatingUp(0);
        card.setRatingDown(0);

        card.setCrops(b.getCrops().stream()
                .map(CropEntity::getName)
                .toList());

        // Check if request exists
        var req = requestRepo.existsBySender_IdAndReceiver_Id(farmerUserId, b.getUser().getId());

        if (req) {
            card.setCanSendRequest(false);
            card.setRequestStatus("PENDING");
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

        // Rating placeholders
        card.setRatingUp(0);
        card.setRatingDown(0);

        card.setCrops(f.getCrops().stream()
                .map(CropEntity::getName)
                .toList());

        // Check if request exists
        var req = requestRepo.existsBySender_IdAndReceiver_Id(buyerUserId, f.getUser().getId());

        if (req) {
            card.setCanSendRequest(false);
            card.setRequestStatus("PENDING");
        } else {
            card.setCanSendRequest(true);
            card.setRequestStatus("NONE");
        }

        return card;
    }
}
