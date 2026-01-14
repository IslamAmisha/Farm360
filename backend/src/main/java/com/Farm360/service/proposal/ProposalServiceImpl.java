package com.Farm360.service.proposal;

import com.Farm360.dto.request.proposal.ProposalCreateRQ;
import com.Farm360.dto.response.proposal.ProposalCropRS;
import com.Farm360.dto.response.proposal.ProposalRS;
import com.Farm360.model.proposal.ProposalCropEntity;
import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.model.request.RequestEntity;
import com.Farm360.repository.proposal.ProposalRepo;
import com.Farm360.repository.request.RequestRepo;
import com.Farm360.utils.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProposalServiceImpl implements ProposalService {

    @Autowired
    private ProposalRepo proposalRepository;

    @Autowired
    private RequestRepo requestRepository;


    @Override
    public ProposalRS createDraftProposal(
            Long senderUserId,
            ProposalCreateRQ rq,
            Role currentUserRole
    ) {

        ProposalEntity proposal;

        /* ---------- LOAD OR CREATE ---------- */
        if (rq.getProposalId() != null) {

            proposal = proposalRepository.findById(rq.getProposalId())
                    .orElseThrow(() -> new RuntimeException("Proposal not found"));

            if (proposal.getProposalStatus() != ProposalStatus.DRAFT) {
                throw new RuntimeException("Only DRAFT proposals can be edited");
            }

            if (Boolean.TRUE.equals(proposal.getLocked())) {
                throw new RuntimeException("Locked proposal cannot be edited");
            }


            if (proposal.getProposalCrops() == null) {
                proposal.setProposalCrops(new ArrayList<>());
            }
            proposal.getProposalCrops().clear();

            if (proposal.getProposalStatus() == ProposalStatus.DRAFT) {
                proposal.setLocked(false);
            }

            proposal.setActionDueAt(null);

        } else {

            proposal = new ProposalEntity();
            proposal.setProposalStatus(ProposalStatus.DRAFT);
            // 🔐 REQUEST-BASED PARTICIPANT LOCK
            RequestEntity req = requestRepository.findById(rq.getRequestId())
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            if (req.getStatus() != RequestStatus.ACCEPTED) {
                throw new RuntimeException("Proposal allowed only for accepted requests");
            }

// 🔑 Determine sender & receiver strictly from request
            proposal.setRequestId(req.getId());
            proposal.setSenderUserId(senderUserId);

// receiver = the OTHER party in the request
            Long receiverId =
                    req.getSender().getId().equals(senderUserId)
                            ? req.getReceiver().getId()
                            : req.getSender().getId();

            proposal.setReceiverUserId(receiverId);

            proposal.setProposalVersion(1);
            proposal.setCreatedByRole(currentUserRole);
            proposal.setActionRequiredBy(
                    currentUserRole == Role.farmer ? Role.buyer : Role.farmer
            );
            proposal.setProposalCrops(new ArrayList<>());
            if (proposal.getProposalStatus() == ProposalStatus.DRAFT) {
                proposal.setLocked(false);
            }

            proposal.setActionDueAt(null);
        }


        /* ---------- BASIC FIELDS ---------- */
        proposal.setLandId(rq.getLandId());
        

        proposal.setLandAreaUsed(
                rq.getLandAreaUsed() != null && rq.getLandAreaUsed() > 0
                        ? rq.getLandAreaUsed()
                        : null
        );

        if (rq.getContractModel() != null) {
            proposal.setContractModel(ContractModel.valueOf(rq.getContractModel().toUpperCase()));
        }

        /* ---------- SEASON ---------- */
        if (proposal.getContractModel() == ContractModel.SEASONAL &&
                rq.getSeason() != null && !rq.getSeason().isBlank()) {
            proposal.setSeason(SeasonType.valueOf(rq.getSeason().toUpperCase()));
        } else {
            proposal.setSeason(null);
        }

        proposal.setPricePerUnit(rq.getPricePerUnit());
        proposal.setEscrowApplicable(rq.getEscrowApplicable());
        proposal.setAdvancePercent(rq.getAdvancePercent());
        proposal.setMidCyclePercent(rq.getMidCyclePercent());
        proposal.setFinalPercent(rq.getFinalPercent());
        proposal.setInputProvided(rq.getInputProvided());
        proposal.setAllowCropChangeBetweenSeasons(rq.getAllowCropChangeBetweenSeasons());
        proposal.setStartYear(rq.getStartYear());
        proposal.setEndYear(rq.getEndYear());

        boolean allProvided =
                rq.getAdvancePercent() != null &&
                        rq.getMidCyclePercent() != null &&
                        rq.getFinalPercent() != null;

        if (allProvided) {
            int total =
                    rq.getAdvancePercent() +
                            rq.getMidCyclePercent() +
                            rq.getFinalPercent();

            if (total != 100) {
                throw new RuntimeException("Payment percentages must total 100");
            }
        }

        if (rq.getDeliveryLocation() != null) {
            proposal.setDeliveryLocation(
                    DeliveryLocation.valueOf(rq.getDeliveryLocation().toUpperCase())
            );
        }

        proposal.setDeliveryWindow(rq.getDeliveryWindow());

        if (rq.getLogisticsHandledBy() != null) {
            proposal.setLogisticsHandledBy(
                    LogisticsHandledBy.valueOf(rq.getLogisticsHandledBy().toUpperCase())
            );
        }

        /* ---------- REMARKS (APPEND ONLY) ---------- */
        if (rq.getRemarks() != null && !rq.getRemarks().isBlank()) {

            String prefix = "[" + LocalDateTime.now() +
                    " | " + currentUserRole.name() + "] ";

            String newRemark = prefix + rq.getRemarks();

            if (proposal.getRemarks() == null) {
                proposal.setRemarks(newRemark);
            } else {
                proposal.setRemarks(proposal.getRemarks() + "\n" + newRemark);
            }
        }

        /* ---------- CROPS ---------- */
        if (rq.getProposalCrops() != null) {
            for (var cropRQ : rq.getProposalCrops()) {

                ProposalCropEntity crop = ProposalCropEntity.builder()
                        .proposal(proposal)
                        .cropId(cropRQ.getCropId())
                        .cropSubCategoryId(cropRQ.getCropSubCategoryId())
                        .season(
                                cropRQ.getSeason() != null && !cropRQ.getSeason().isBlank()
                                        ? SeasonType.valueOf(cropRQ.getSeason())
                                        : null
                        )
                        .expectedQuantity(cropRQ.getExpectedQuantity())
                        .unit(
                                cropRQ.getUnit() != null
                                        ? UnitType.valueOf(cropRQ.getUnit().toUpperCase())
                                        : UnitType.QUINTAL
                        )
                        .landAreaUsed(cropRQ.getLandAreaUsed())
                        .build();

                if (proposal.getContractModel() == ContractModel.SEASONAL) {
                    crop.setSeason(proposal.getSeason());
                }

                proposal.getProposalCrops().add(crop);
            }
        }

        /* =========================================================
   CONTRACT MODEL VALIDATION
========================================================= */
        if (proposal.getContractModel() != null) {

            List<ProposalCropEntity> crops = proposal.getProposalCrops();

            if (crops == null || crops.isEmpty()) {
                return mapEntityToRS(proposalRepository.save(proposal)); // allow empty in DRAFT
            }

            /* ---------- SEASONAL ---------- */
            if (proposal.getContractModel() == ContractModel.SEASONAL) {

                if (proposal.getSeason() == null) {
                    throw new RuntimeException("Season is required for seasonal contract");
                }

                if (crops.size() != 1) {
                    throw new RuntimeException("Seasonal contract must have exactly one crop");
                }

                ProposalCropEntity c = crops.get(0);

                if (c.getSeason() != null &&
                        c.getSeason() != proposal.getSeason()) {
                    throw new RuntimeException("Crop season must match proposal season");
                }

                if (c.getLandAreaUsed() == null || c.getLandAreaUsed() <= 0) {
                    throw new RuntimeException("Crop land area is required");
                }

                if (proposal.getLandAreaUsed() != null &&
                        c.getLandAreaUsed() > proposal.getLandAreaUsed()) {
                    throw new RuntimeException(
                            "Crop area cannot exceed total land area"
                    );
                }
            }

            /* ---------- ANNUAL ---------- */
            if (proposal.getContractModel() == ContractModel.ANNUAL) {

                if (crops.size() > 3) {
                    throw new RuntimeException(
                            "Annual contract can have maximum 3 crops"
                    );
                }

                if (proposal.getLandAreaUsed() == null || proposal.getLandAreaUsed() <= 0) {
                    throw new RuntimeException("Land area is required for annual contract");
                }

                for (ProposalCropEntity c : crops) {

                    if (c.getSeason() == null) {
                        throw new RuntimeException(
                                "Each crop must specify a season in annual contract"
                        );
                    }

                    if (c.getLandAreaUsed() == null ||
                            !c.getLandAreaUsed().equals(proposal.getLandAreaUsed())) {

                        throw new RuntimeException(
                                "Each crop must use the full land area in annual contract"
                        );
                    }

                    if (c.getExpectedQuantity() == null || c.getExpectedQuantity() <= 0) {
                        throw new RuntimeException("Crop quantity is required");
                    }

                    if (c.getUnit() == null) {
                        throw new RuntimeException("Crop unit is required");
                    }
                }
            }
        }


        /* ---------- TOTAL AMOUNT ---------- */
        double totalAmount = proposal.getProposalCrops().stream()
                .mapToDouble(c ->
                        (c.getExpectedQuantity() == null ? 0 : c.getExpectedQuantity()) *
                                (proposal.getPricePerUnit() == null ? 0 : proposal.getPricePerUnit())
                )
                .sum();

        proposal.setTotalContractAmount(totalAmount);

        return mapEntityToRS(proposalRepository.save(proposal));
    }

    /* =========================================================
       SEND PROPOSAL
    ========================================================= */
    @Override
    public void sendProposal(Long senderUserId, Long proposalId, Role currentUserRole) {



        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (!proposal.getSenderUserId().equals(senderUserId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (proposal.getProposalStatus() != ProposalStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT proposals can be sent");
        }

        if (proposal.getReceiverUserId() == null) {
            throw new RuntimeException("Receiver is required");
        }

        if (proposal.getProposalCrops() == null || proposal.getProposalCrops().isEmpty()) {
            throw new RuntimeException("Cannot send proposal without crops");
        }

        if (proposal.getPricePerUnit() == null || proposal.getPricePerUnit() <= 0) {
            throw new RuntimeException("Price per unit is required");
        }

        if (proposal.getDeliveryLocation() == null) {
            throw new RuntimeException("Delivery location is required");
        }

        if (proposal.getLogisticsHandledBy() == null) {
            throw new RuntimeException("Logistics handler is required");
        }

        int totalPercent =
                (proposal.getAdvancePercent() == null ? 0 : proposal.getAdvancePercent()) +
                        (proposal.getMidCyclePercent() == null ? 0 : proposal.getMidCyclePercent()) +
                        (proposal.getFinalPercent() == null ? 0 : proposal.getFinalPercent());

        if (totalPercent != 100) {
            throw new RuntimeException("Payment percentages must total 100");
        }

        if (Boolean.TRUE.equals(proposal.getLocked())) {
            throw new RuntimeException("Locked proposal cannot be sent");
        }
        LocalDateTime expiry = LocalDateTime.now().plusDays(7);

        proposal.setProposalStatus(ProposalStatus.SENT);
        proposal.setActionRequiredBy(
                currentUserRole == Role.farmer ? Role.buyer : Role.farmer
        );

        proposal.setActionDueAt(expiry);
        proposal.setValidUntil(expiry);
        proposal.setLocked(true);

        proposalRepository.save(proposal);
    }

    /* =========================================================
       ACCEPT / REJECT / CANCEL
    ========================================================= */
    @Override
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
        proposal.setActionDueAt(null);
        proposal.setValidUntil(null);

        proposalRepository.save(proposal);
    }

    @Override
    public void rejectProposal(Long receiverUserId, Long proposalId) {

        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (!proposal.getReceiverUserId().equals(receiverUserId)) {
            throw new RuntimeException("Unauthorized");
        }

        proposal.setProposalStatus(ProposalStatus.REJECTED);
        proposal.setRejectedAt(LocalDateTime.now());
        proposal.setLocked(true);
        proposal.setActionDueAt(null);
        proposal.setValidUntil(null);

        proposalRepository.save(proposal);
    }

    @Override
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
        proposal.setActionDueAt(null);
        proposal.setValidUntil(null);

        proposalRepository.save(proposal);
    }

    /* =========================================================
       FETCH METHODS
    ========================================================= */
    @Override
    public ProposalRS getProposalById(Long userId, Long proposalId) {

        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (!proposal.getSenderUserId().equals(userId) &&
                !proposal.getReceiverUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        return mapEntityToRS(proposal);
    }

    @Override
    public List<ProposalRS> getProposalsByRequest(Long userId, Long requestId) {

        return proposalRepository.findByRequestId(requestId).stream()
                .filter(p -> p.getSenderUserId().equals(userId)
                        || p.getReceiverUserId().equals(userId))
                .map(this::mapEntityToRS)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProposalRS> getIncomingProposals(Long receiverUserId) {

        return proposalRepository
                .findByReceiverUserIdAndProposalStatus(receiverUserId, ProposalStatus.SENT)
                .stream()
                .filter(p -> p.getActionDueAt() != null &&
                        p.getActionDueAt().isAfter(LocalDateTime.now()))
                .map(this::mapEntityToRS)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProposalRS> getOutgoingProposals(Long senderUserId) {

        return proposalRepository.findBySenderUserId(senderUserId)
                .stream()
                .map(this::mapEntityToRS)
                .collect(Collectors.toList());
    }

    /* =========================================================
       COUNTER PROPOSAL
    ========================================================= */

    @Override
    public ProposalRS createCounterProposal(Long userId, Long proposalId) {

        ProposalEntity old = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        // ✅ 1. VALIDATIONS FIRST
        if (old.getProposalStatus() != ProposalStatus.SENT) {
            throw new RuntimeException("Only SENT proposals can be countered");
        }

        if (!old.getReceiverUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        // ✅ 2. CLOSE OLD PROPOSAL
        old.setProposalStatus(ProposalStatus.COUNTERED);
        old.setLocked(true);
        old.setActionDueAt(null);
        old.setValidUntil(null);

        proposalRepository.save(old);

        // ✅ 3. CREATE COUNTER PROPOSAL
        ProposalEntity counter = ProposalEntity.builder()
                .requestId(old.getRequestId())
                .senderUserId(old.getReceiverUserId())
                .receiverUserId(old.getSenderUserId())
                .landId(old.getLandId())
                .landAreaUsed(old.getLandAreaUsed())
                .contractModel(old.getContractModel())
                .season(old.getSeason())
                .pricePerUnit(old.getPricePerUnit())
                .advancePercent(old.getAdvancePercent())
                .midCyclePercent(old.getMidCyclePercent())
                .finalPercent(old.getFinalPercent())
                .deliveryLocation(old.getDeliveryLocation())
                .deliveryWindow(old.getDeliveryWindow())
                .logisticsHandledBy(old.getLogisticsHandledBy())
                .allowCropChangeBetweenSeasons(old.getAllowCropChangeBetweenSeasons())
                .startYear(old.getStartYear())
                .endYear(old.getEndYear())
                .remarks(old.getRemarks())
                .proposalStatus(ProposalStatus.DRAFT)
                .proposalVersion(old.getProposalVersion() + 1)
                .parentProposalId(old.getProposalId())
                .createdByRole(old.getActionRequiredBy())
                .locked(false)
                .build();

        counter.setActionRequiredBy(
                old.getCreatedByRole() == Role.buyer ? Role.farmer : Role.buyer
        );

        counter.setProposalCrops(new ArrayList<>());

        for (ProposalCropEntity c : old.getProposalCrops()) {
            counter.getProposalCrops().add(
                    ProposalCropEntity.builder()
                            .proposal(counter)
                            .cropId(c.getCropId())
                            .cropSubCategoryId(c.getCropSubCategoryId())
                            .season(c.getSeason())
                            .expectedQuantity(c.getExpectedQuantity())
                            .unit(c.getUnit())
                            .landAreaUsed(c.getLandAreaUsed())
                            .build()
            );
        }

        return mapEntityToRS(proposalRepository.save(counter));
    }


    /* =========================================================
       MAPPER
    ========================================================= */
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
                                                .season(c.getSeason() != null ? c.getSeason().name() : null)
                                                .expectedQuantity(c.getExpectedQuantity())
                                                .unit(c.getUnit() != null ? c.getUnit().name() : null)
                                                .landAreaUsed(c.getLandAreaUsed())
                                                .build())
                                        .collect(Collectors.toList())
                )

                .contractModel(p.getContractModel() != null ? p.getContractModel().name() : null)
                .season(p.getSeason() != null ? p.getSeason().name() : null)

                .pricePerUnit(p.getPricePerUnit())
                .totalContractAmount(p.getTotalContractAmount())

                .deliveryLocation(p.getDeliveryLocation() != null ? p.getDeliveryLocation().name() : null)
                .logisticsHandledBy(p.getLogisticsHandledBy() != null ? p.getLogisticsHandledBy().name() : null)

                .startYear(p.getStartYear())
                .endYear(p.getEndYear())

                .proposalStatus(p.getProposalStatus().name())

                .validUntil(p.getValidUntil())
                .actionDueAt(p.getActionDueAt())

                .createdAt(
                        p.getCreatedDate().toInstant()
                                .atZone(ZoneId.of("Asia/Kolkata"))
                                .toLocalDateTime()
                )
                .updatedAt(
                        p.getModifiedDate().toInstant()
                                .atZone(ZoneId.of("Asia/Kolkata"))
                                .toLocalDateTime()
                )
                .build();
    }


    @Transactional
    public void saveAndSendProposal(
            Long senderUserId,
            ProposalCreateRQ rq,
            Role role
    ) {
        // 1. Save latest values
        ProposalRS rs = createDraftProposal(senderUserId, rq, role);

        // 2. Send immediately
        sendProposal(senderUserId, rs.getProposalId(), role);
    }

}
