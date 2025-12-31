package com.Farm360.service.proposal;



import com.Farm360.dto.request.proposal.ProposalCreateRQ;
import com.Farm360.dto.response.proposal.ProposalCropRS;
import com.Farm360.dto.response.proposal.ProposalRS;
import com.Farm360.model.proposal.*;
import com.Farm360.repository.proposal.ProposalRepo;
import com.Farm360.utils.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private final ProposalRepo proposalRepository;

    public ProposalRS createDraftProposal(Long senderUserId, ProposalCreateRQ rq,Role currentUserRole) {

        ProposalEntity proposal;

        if (rq.getProposalId() != null) {
            proposal = proposalRepository.findById(rq.getProposalId())
                    .orElseThrow(() -> new RuntimeException("Proposal not found"));

            if (proposal.getProposalStatus() != ProposalStatus.DRAFT) {
                throw new RuntimeException("Only DRAFT proposals can be edited");
            }

            if (proposal.getProposalCrops() == null) {
                proposal.setProposalCrops(new ArrayList<>());
            }
            proposal.getProposalCrops().clear();
            proposal.setActionDueAt(null);
            proposal.setLocked(false);



        } else {
            proposal = new ProposalEntity();
            proposal.setProposalStatus(ProposalStatus.DRAFT);
            proposal.setSenderUserId(senderUserId);
            proposal.setReceiverUserId(rq.getReceiverUserId());
            proposal.setRequestId(rq.getRequestId());
            proposal.setProposalVersion(1);
            proposal.setCreatedByRole(currentUserRole);
            proposal.setActionRequiredBy(
                    currentUserRole == Role.farmer ? Role.buyer : Role.farmer
            );
        }

        mapRQToEntity(rq, proposal);

        if (rq.getLandAreaUsed() == null || rq.getLandAreaUsed() <= 0) {
            throw new RuntimeException("Land area is required");
        }
        proposal.setLandAreaUsed(rq.getLandAreaUsed());

        if (rq.getProposalCrops() == null || rq.getProposalCrops().isEmpty()) {
            throw new RuntimeException("At least one crop is required");
        }

        for (var cropRQ : rq.getProposalCrops()) {
            ProposalCropEntity crop = ProposalCropEntity.builder()
                    .proposal(proposal)
                    .cropId(cropRQ.getCropId())
                    .cropSubCategoryId(cropRQ.getCropSubCategoryId())
                    .season(SeasonType.valueOf(cropRQ.getSeason()))
                    .expectedQuantity(cropRQ.getExpectedQuantity())
                    .unit(UnitType.valueOf(cropRQ.getUnit()))
                    .landAreaUsed(cropRQ.getLandAreaUsed())
                    .build();

            proposal.getProposalCrops().add(crop);
        }

        if (proposal.getContractModel() == ContractModel.SEASONAL &&
                proposal.getProposalCrops().size() != 1) {
            throw new RuntimeException("Seasonal contract must have exactly one crop");
        }

        if (proposal.getContractModel() == ContractModel.ANNUAL &&
                proposal.getProposalCrops().size() < 2) {
            throw new RuntimeException("Annual contract must have multiple crops");
        }
// NOTE: v1 assumes single pricePerUnit for all crops

        double totalAmount = proposal.getProposalCrops().stream()
                .mapToDouble(c -> c.getExpectedQuantity() * proposal.getPricePerUnit())
                .sum();

        proposal.setTotalContractAmount(totalAmount);

        return mapEntityToRS(proposalRepository.save(proposal));
    }


    /* -------------------- SEND PROPOSAL -------------------- */
    public void sendProposal(Long senderUserId, Long proposalId,Role currentUserRole) {

        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (!proposal.getSenderUserId().equals(senderUserId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (proposal.getProposalStatus() != ProposalStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT proposals can be sent");
        }
        if (proposal.getProposalCrops() == null || proposal.getProposalCrops().isEmpty()) {
            throw new RuntimeException("Cannot send proposal without crops");
        }


        int totalPercent =
                proposal.getAdvancePercent() +
                        proposal.getMidCyclePercent() +
                        proposal.getFinalPercent();

        if (totalPercent != 100) {
            throw new RuntimeException("Payment percentages must total 100");
        }

        proposal.setProposalStatus(ProposalStatus.SENT);
        proposal.setActionRequiredBy(
                currentUserRole == Role.farmer ? Role.buyer : Role.farmer
        );

        proposal.setActionDueAt(LocalDateTime.now().plusDays(7));

        proposalRepository.save(proposal);
    }


    /* -------------------- ACCEPT PROPOSAL -------------------- */
    public void acceptProposal(Long receiverUserId, Long proposalId) {

        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (!proposal.getReceiverUserId().equals(receiverUserId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (proposal.getProposalStatus() != ProposalStatus.SENT) {
            throw new RuntimeException("Only SENT proposals can be accepted");
        }

        proposal.setProposalStatus(ProposalStatus.ACCEPTED);
        proposal.setAcceptedAt(LocalDateTime.now());
        proposal.setLocked(true);

        proposalRepository.save(proposal);
    }

    /* -------------------- REJECT PROPOSAL -------------------- */
    public void rejectProposal(Long receiverUserId, Long proposalId) {
        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (!proposal.getReceiverUserId().equals(receiverUserId)) {
            throw new RuntimeException("Unauthorized");
        }

        proposal.setProposalStatus(ProposalStatus.REJECTED);
        proposal.setRejectedAt(LocalDateTime.now());
        proposal.setLocked(true);

        proposalRepository.save(proposal);
    }

    /* -------------------- CANCEL PROPOSAL -------------------- */
    public void cancelProposal(Long senderUserId, Long proposalId) {
        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (!proposal.getSenderUserId().equals(senderUserId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (!(proposal.getProposalStatus() == ProposalStatus.DRAFT ||
                proposal.getProposalStatus() == ProposalStatus.SENT)) {
            throw new RuntimeException("Only DRAFT or SENT proposals can be cancelled");
        }

        proposal.setProposalStatus(ProposalStatus.CANCELLED);
        proposal.setLocked(true);


        proposalRepository.save(proposal);
    }

    /* -------------------- FETCH PROPOSALS -------------------- */
    public ProposalRS getProposalById(Long userId, Long proposalId) {
        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (!proposal.getSenderUserId().equals(userId) && !proposal.getReceiverUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        return mapEntityToRS(proposal);
    }

    public List<ProposalRS> getProposalsByRequest(Long userId, Long requestId) {
        List<ProposalEntity> proposals = proposalRepository.findByRequestId(requestId);

        // Filter by user participation
        proposals = proposals.stream()
                .filter(p -> p.getSenderUserId().equals(userId) || p.getReceiverUserId().equals(userId))
                .collect(Collectors.toList());

        return proposals.stream().map(this::mapEntityToRS).collect(Collectors.toList());
    }

    public List<ProposalRS> getIncomingProposals(Long receiverUserId) {
        List<ProposalEntity> proposals = proposalRepository.findByReceiverUserIdAndProposalStatus(
                receiverUserId, ProposalStatus.SENT
        );

        // Filter by validUntil
        proposals = proposals.stream()
                .filter(p -> p.getActionDueAt().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());

        return proposals.stream().map(this::mapEntityToRS).collect(Collectors.toList());
    }

    public List<ProposalRS> getOutgoingProposals(Long senderUserId) {
        List<ProposalEntity> proposals = proposalRepository.findBySenderUserId(senderUserId);

        return proposals.stream().map(this::mapEntityToRS).collect(Collectors.toList());
    }

    /* -------------------- MAPPERS -------------------- */
    private void mapRQToEntity(ProposalCreateRQ rq, ProposalEntity p) {

        p.setLandId(rq.getLandId());
        p.setCropId(rq.getCropId());
        p.setCropSubCategoryId(rq.getCropSubCategoryId());

        if (rq.getContractModel() != null)
            p.setContractModel(ContractModel.valueOf(rq.getContractModel()));
        if (rq.getSeason() != null)
            p.setSeason(SeasonType.valueOf(rq.getSeason()));

        p.setExpectedQuantity(rq.getExpectedQuantity());
        if (rq.getUnit() != null)
            p.setUnit(UnitType.valueOf(rq.getUnit()));

        p.setPricePerUnit(rq.getPricePerUnit());


        p.setEscrowApplicable(rq.getEscrowApplicable());
        p.setAdvancePercent(rq.getAdvancePercent());
        p.setMidCyclePercent(rq.getMidCyclePercent());
        p.setFinalPercent(rq.getFinalPercent());
        p.setRemarks(rq.getRemarks());


        p.setInputProvided(rq.getInputProvided());
        if (rq.getDeliveryLocation() != null)
            p.setDeliveryLocation(DeliveryLocation.valueOf(rq.getDeliveryLocation()));
        p.setDeliveryWindow(rq.getDeliveryWindow());

        if (rq.getLogisticsHandledBy() != null)
            p.setLogisticsHandledBy(LogisticsHandledBy.valueOf(rq.getLogisticsHandledBy()));

        p.setAllowCropChangeBetweenSeasons(rq.getAllowCropChangeBetweenSeasons());
        p.setStartYear(rq.getStartYear());
        p.setEndYear(rq.getEndYear());
    }

    private ProposalRS mapEntityToRS(ProposalEntity p) {
        return ProposalRS.builder()
                .proposalId(p.getProposalId())
                .requestId(p.getRequestId())
                .senderUserId(p.getSenderUserId())
                .receiverUserId(p.getReceiverUserId())
                .landId(p.getLandId())
                .proposalCrops(
                        p.getProposalCrops() == null ? List.of() :
                                p.getProposalCrops().stream()
                                        .map(c -> ProposalCropRS.builder()
                                                .cropId(c.getCropId())
                                                .cropSubCategoryId(c.getCropSubCategoryId())
                                                .season(c.getSeason().name())
                                                .expectedQuantity(c.getExpectedQuantity())
                                                .unit(c.getUnit().name())
                                                .landAreaUsed(c.getLandAreaUsed())
                                                .build())
                                        .collect(Collectors.toList())
                )

                .cropId(p.getCropId())
                .cropSubCategoryId(p.getCropSubCategoryId())
                .contractModel(p.getContractModel() != null ? p.getContractModel().name() : null)
                .season(p.getSeason() != null ? p.getSeason().name() : null)
                .expectedQuantity(p.getExpectedQuantity())
                .unit(p.getUnit() != null ? p.getUnit().name() : null)
                .pricePerUnit(p.getPricePerUnit())
                .totalContractAmount(p.getTotalContractAmount())
                .escrowApplicable(p.getEscrowApplicable())
                .advancePercent(p.getAdvancePercent())
                .midCyclePercent(p.getMidCyclePercent())
                .finalPercent(p.getFinalPercent())
                .inputProvided(p.getInputProvided())
                .deliveryLocation(p.getDeliveryLocation() != null ? p.getDeliveryLocation().name() : null)
                .deliveryWindow(p.getDeliveryWindow())
                .logisticsHandledBy(p.getLogisticsHandledBy() != null ? p.getLogisticsHandledBy().name() : null)
                .allowCropChangeBetweenSeasons(p.getAllowCropChangeBetweenSeasons())
                .startYear(p.getStartYear())
                .endYear(p.getEndYear())
                .proposalStatus(p.getProposalStatus() != null ? p.getProposalStatus().name() : null)
                .createdAt(p.getCreatedDate().toInstant().atZone(ZoneId.of("Asia/Kolkata")).toLocalDateTime())
                .updatedAt(p.getModifiedDate().toInstant().atZone(ZoneId.of("Asia/Kolkata")).toLocalDateTime())
                .build();
    }

    public ProposalRS createCounterProposal(Long userId, Long proposalId) {

        ProposalEntity oldProposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        // Only SENT proposals can be countered
        if (oldProposal.getProposalStatus() != ProposalStatus.SENT) {
            throw new RuntimeException("Only SENT proposals can be countered");
        }

        // Only receiver can counter
        if (!oldProposal.getReceiverUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to counter this proposal");
        }

        // Clone proposal
        ProposalEntity counter = ProposalEntity.builder()
                .requestId(oldProposal.getRequestId())

                // swap sender & receiver
                .senderUserId(oldProposal.getReceiverUserId())
                .receiverUserId(oldProposal.getSenderUserId())

                .landId(oldProposal.getLandId())
                .landAreaUsed(oldProposal.getLandAreaUsed())

                .cropId(oldProposal.getCropId())
                .cropSubCategoryId(oldProposal.getCropSubCategoryId())

                .contractModel(oldProposal.getContractModel())
                .season(oldProposal.getSeason())

                .expectedQuantity(oldProposal.getExpectedQuantity())
                .unit(oldProposal.getUnit())

                .pricePerUnit(oldProposal.getPricePerUnit())

                .escrowApplicable(oldProposal.getEscrowApplicable())
                .advancePercent(oldProposal.getAdvancePercent())
                .midCyclePercent(oldProposal.getMidCyclePercent())
                .finalPercent(oldProposal.getFinalPercent())

                .inputProvided(oldProposal.getInputProvided())
                .deliveryLocation(oldProposal.getDeliveryLocation())
                .deliveryWindow(oldProposal.getDeliveryWindow())

                .logisticsHandledBy(oldProposal.getLogisticsHandledBy())
                .allowCropChangeBetweenSeasons(oldProposal.getAllowCropChangeBetweenSeasons())

                .startYear(oldProposal.getStartYear())
                .endYear(oldProposal.getEndYear())
                .remarks(oldProposal.getRemarks())


                // negotiation fields
                .proposalStatus(ProposalStatus.DRAFT)
                .proposalVersion(oldProposal.getProposalVersion() + 1)
                .parentProposalId(oldProposal.getProposalId())
                .createdByRole(
                        oldProposal.getReceiverUserId().equals(userId) ?
                                oldProposal.getActionRequiredBy() : oldProposal.getCreatedByRole()
                )

                .locked(false)
                .build();
        counter.setActionDueAt(null);


        counter.setActionRequiredBy(
                oldProposal.getCreatedByRole() == Role.buyer ? Role.farmer : Role.buyer
        );

        counter.setProposalCrops(new ArrayList<>());

        for (ProposalCropEntity oldCrop : oldProposal.getProposalCrops()) {
            ProposalCropEntity newCrop = ProposalCropEntity.builder()
                    .proposal(counter)
                    .cropId(oldCrop.getCropId())
                    .cropSubCategoryId(oldCrop.getCropSubCategoryId())
                    .season(oldCrop.getSeason())
                    .expectedQuantity(oldCrop.getExpectedQuantity())
                    .unit(oldCrop.getUnit())
                    .landAreaUsed(oldCrop.getLandAreaUsed())
                    .build();

            counter.getProposalCrops().add(newCrop);


        }

        return mapEntityToRS(proposalRepository.save(counter));
    }

}
