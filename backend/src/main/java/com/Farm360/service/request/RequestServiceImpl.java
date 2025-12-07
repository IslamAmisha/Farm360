package com.Farm360.service.request;

import com.Farm360.dto.request.sendreq.SendRequestRQ;
import com.Farm360.dto.request.sendreq.UpdateRequestRQ;
import com.Farm360.dto.response.sendreq.RequestListItemRS;
import com.Farm360.dto.response.sendreq.RequestListRS;
import com.Farm360.dto.response.sendreq.SendRequestRS;
import com.Farm360.dto.response.sendreq.UpdateRequestRS;
import com.Farm360.model.UserEntity;
import com.Farm360.model.request.RequestEntity;
import com.Farm360.repository.UserRepo;
import com.Farm360.repository.request.RequestRepo;
import com.Farm360.utils.RequestStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class RequestServiceImpl implements RequestService {
    @Autowired
    private RequestRepo requestRepo;
    @Autowired
    private UserRepo userRepo;

    @Override
    public SendRequestRS sendRequest(Long senderId, SendRequestRQ rq) {

        SendRequestRS rs = new SendRequestRS();

        Long receiverId = rq.getReceiverId();

        if (senderId.equals(receiverId)) {
            rs.setSuccess(false);
            rs.setMessage("Cannot send request to yourself.");
            return rs;
        }

        // check duplicate request
        if (requestRepo.existsBySender_IdAndReceiver_Id(senderId, receiverId)) {
            rs.setSuccess(false);
            rs.setMessage("Request already sent.");
            return rs;
        }

        UserEntity sender = userRepo.findById(senderId).orElseThrow();
        UserEntity receiver = userRepo.findById(receiverId).orElseThrow();

        RequestEntity request = new RequestEntity();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(RequestStatus.PENDING);

        requestRepo.save(request);

        rs.setSuccess(true);
        rs.setMessage("Request sent successfully.");
        return rs;
    }

    @Override
    public UpdateRequestRS updateRequest(UpdateRequestRQ rq) {

        UpdateRequestRS rs = new UpdateRequestRS();

        RequestEntity req = requestRepo.findById(rq.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

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

                    // -----------------------------------
                    //   RECEIVER = BUYER OR FARMER
                    // -----------------------------------
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



