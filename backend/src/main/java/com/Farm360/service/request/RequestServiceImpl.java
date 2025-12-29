package com.Farm360.service.request;

import com.Farm360.dto.request.sendreq.SendRequestRQ;
import com.Farm360.dto.request.sendreq.UpdateRequestRQ;
import com.Farm360.dto.response.sendreq.RequestListItemRS;
import com.Farm360.dto.response.sendreq.RequestListRS;
import com.Farm360.dto.response.sendreq.SendRequestRS;
import com.Farm360.dto.response.sendreq.UpdateRequestRS;
import com.Farm360.model.UserEntity;
import com.Farm360.model.land.LandCropEntity;
import com.Farm360.model.land.LandEntity;
import com.Farm360.model.master.crop.CropEntity;
import com.Farm360.model.master.cropsubcategory.CropSubCategoriesEntity;
import com.Farm360.model.request.RequestEntity;
import com.Farm360.repository.UserRepo;
import com.Farm360.repository.land.LandRepository;
import com.Farm360.repository.master.CropRepo;
import com.Farm360.repository.request.RequestRepo;
import com.Farm360.utils.RequestStatus;
import com.Farm360.utils.SeasonType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class RequestServiceImpl implements RequestService {
    @Autowired
    private RequestRepo requestRepo;
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CropRepo cropRepo;

    @Autowired
    private LandRepository landRepo;

    @Override
    public SendRequestRS sendRequest(Long senderId, SendRequestRQ rq) {

        SendRequestRS rs = new SendRequestRS();

        // -------- BASIC CHECKS --------
        if (senderId.equals(rq.getReceiverId())) {
            rs.setSuccess(false);
            rs.setMessage("Cannot send request to yourself");
            return rs;
        }

        if (rq.getLandId() == null ||
                rq.getCropId() == null ||
                rq.getSubCategoryId() == null) {
            rs.setSuccess(false);
            rs.setMessage("Land and crop are required");
            return rs;
        }

        UserEntity sender = userRepo.findById(senderId).orElseThrow();
        UserEntity receiver = userRepo.findById(rq.getReceiverId()).orElseThrow();

        // -------- LOAD LAND --------
        LandEntity land = landRepo.findById(rq.getLandId())
                .orElseThrow(() -> new RuntimeException("Invalid land"));

        // -------- OWNERSHIP CHECK --------
        if (!land.getFarmer().getUser().getId().equals(senderId)) {
            rs.setSuccess(false);
            rs.setMessage("Land does not belong to farmer");
            return rs;
        }

        // -------- VALIDATE SUBCATEGORY BELONGS TO LAND --------
        LandCropEntity landCrop = land.getLandCrops().stream()
                .filter(lc -> lc.getCropSubCategory().getId().equals(rq.getSubCategoryId()))
                .findFirst()
                .orElse(null);

        if (landCrop == null) {
            rs.setSuccess(false);
            rs.setMessage("Invalid crop selected");
            return rs;
        }

        CropSubCategoriesEntity subCategory = landCrop.getCropSubCategory();
        CropEntity crop = subCategory.getCrop(); // 🔑 MASTER CROP

        // -------- DUPLICATE CHECK --------
        if (requestRepo.existsBySender_IdAndReceiver_IdAndCrop_IdAndCropSubCategory_IdAndLand_Id(
                senderId,
                rq.getReceiverId(),
                crop.getId(),
                subCategory.getId(),
                land.getId()
        )) {
            rs.setSuccess(false);
            rs.setMessage("Request already sent for this land and crop type");
            return rs;
        }


        // -------- CREATE REQUEST --------
        RequestEntity request = new RequestEntity();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setLand(land);
        request.setCrop(crop);
        request.setCropSubCategory(subCategory);
        request.setSeason(rq.getSeason());
        request.setStatus(RequestStatus.PENDING);


        requestRepo.save(request);

        rs.setSuccess(true);
        rs.setMessage("Request sent successfully");
        return rs;
    }





    @Override
    public UpdateRequestRS updateRequest(UpdateRequestRQ rq) {

        UpdateRequestRS rs = new UpdateRequestRS();

        RequestEntity req = requestRepo.findById(rq.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // -------- AUTHORIZATION CHECK --------
        if (!req.getReceiver().getId().equals(rq.getActionUserId())) {
            rs.setSuccess(false);
            rs.setMessage("You are not authorized to update this request");
            return rs;
        }


        if (rq.getAction().equalsIgnoreCase("ACCEPT")) {
            req.setStatus(RequestStatus.ACCEPTED);
        } else if (rq.getAction().equalsIgnoreCase("REJECT")) {
            req.setStatus(RequestStatus.REJECTED);
        } else {
            rs.setSuccess(false);
            rs.setMessage("Invalid action");
            return rs;
        }

        requestRepo.save(req);

        rs.setSuccess(true);
        rs.setMessage("Request updated successfully.");
        return rs;
    }

    @Override
    public RequestListRS getIncomingRequests(Long userId) {

        var list = requestRepo.findByReceiver_Id(userId);

        RequestListRS rs = new RequestListRS();

        rs.setRequests(
                list.stream().map(req -> {
                    RequestListItemRS item = new RequestListItemRS();

                    item.setRequestId(req.getId());

                    item.setSenderId(req.getSender().getId());
                    item.setSenderName(getName(req.getSender()));
                    item.setSenderRole(req.getSender().getRole().name());

                    if (req.getSender().getBuyer() != null) {

                        var b = req.getSender().getBuyer();

                        // Company = businessName
                        item.setCompanyName(b.getBusinessName());

                        // City + District
                        item.setCity(b.getCity() != null ? b.getCity().getName() : "");
                        item.setDistrict(b.getDistrict() != null ? b.getDistrict().getName() : "");

                        // Ratings not available yet
                        item.setThumbsUp(0);
                        item.setThumbsDown(0);

                    } else if (req.getSender().getFarmer() != null) {

                        var f = req.getSender().getFarmer();

                        // CompanyName = farmerName
                        item.setCompanyName(f.getFarmerName());

                        // Village + District (no city)
                        item.setCity(f.getVillage() != null ? f.getVillage() : "");
                        item.setDistrict(f.getDistrict() != null ? f.getDistrict().getName() : "");

                        item.setThumbsUp(0);
                        item.setThumbsDown(0);
                    }

                    // Receiver
                    item.setReceiverId(req.getReceiver().getId());
                    item.setReceiverName(getName(req.getReceiver()));
                    item.setReceiverRole(req.getReceiver().getRole().name());

                    item.setStatus(req.getStatus().name());
                    item.setCreatedAt(req.getCreatedAt().toString());

                    item.setCropId(req.getCrop().getId());
                    item.setCropName(req.getCrop().getName());

                    item.setSubCategoryId(req.getCropSubCategory().getId());
                    item.setSubCategoryName(req.getCropSubCategory().getName());


                    if (req.getLand() != null) {
                        item.setLandId(req.getLand().getId());
                        item.setLandSize(req.getLand().getSize());
                    }

                    return item;
                }).collect(Collectors.toList())
        );

        return rs;
    }



    @Override
    public RequestListRS getOutgoingRequests(Long userId) {

        var list = requestRepo.findBySender_Id(userId);

        RequestListRS rs = new RequestListRS();

        rs.setRequests(
                list.stream().map(req -> {
                    RequestListItemRS item = new RequestListItemRS();

                    item.setRequestId(req.getId());

                    item.setSenderId(req.getSender().getId());
                    item.setSenderName(getName(req.getSender()));
                    item.setSenderRole(req.getSender().getRole().name());

                    item.setReceiverId(req.getReceiver().getId());
                    item.setReceiverName(getName(req.getReceiver()));
                    item.setReceiverRole(req.getReceiver().getRole().name());


                    if (req.getReceiver().getBuyer() != null) {

                        var b = req.getReceiver().getBuyer();

                        item.setCompanyName(b.getBusinessName());
                        item.setCity(b.getCity() != null ? b.getCity().getName() : "");
                        item.setDistrict(b.getDistrict() != null ? b.getDistrict().getName() : "");
                        item.setThumbsUp(0);
                        item.setThumbsDown(0);

                    } else if (req.getReceiver().getFarmer() != null) {

                        var f = req.getReceiver().getFarmer();

                        item.setCompanyName(f.getFarmerName());
                        item.setCity(f.getVillage() != null ? f.getVillage() : "");
                        item.setDistrict(f.getDistrict() != null ? f.getDistrict().getName() : "");
                        item.setThumbsUp(0);
                        item.setThumbsDown(0);
                    }

                    item.setStatus(req.getStatus().name());
                    item.setCreatedAt(req.getCreatedAt().toString());

                    item.setCropId(req.getCrop().getId());
                    item.setCropName(req.getCrop().getName());

                    item.setSubCategoryId(req.getCropSubCategory().getId());
                    item.setSubCategoryName(req.getCropSubCategory().getName());

                    if (req.getLand() != null) {
                        item.setLandId(req.getLand().getId());
                        item.setLandSize(req.getLand().getSize());
                    }



                    return item;
                }).collect(Collectors.toList())
        );

        return rs;
    }


    private String getName(UserEntity user) {
        if (user.getFarmer() != null) {
            return user.getFarmer().getFarmerName();
        }
        if (user.getBuyer() != null) {
            return user.getBuyer().getFullName();
        }
        return "Unknown User";
    }
}



