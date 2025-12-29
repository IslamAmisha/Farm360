package com.Farm360.service.proposal;



import com.Farm360.dto.request.proposal.ProposalCreateRQ;
import com.Farm360.dto.response.proposal.ProposalRS;
import com.Farm360.model.proposal.*;
import com.Farm360.repository.proposal.ProposalRepo;
import com.Farm360.utils.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private final ProposalRepo proposalRepository;

    /* -------------------- CREATE / UPDATE DRAFT -------------------- */
    public ProposalRS createDraftProposal(Long senderUserId, ProposalCreateRQ rq) {

        ProposalEntity proposal;

        if (rq.getProposalId() != null) {
            proposal = proposalRepository.findById(rq.getProposalId())
                    .orElseThrow(() -> new RuntimeException("Proposal not found"));

            if (proposal.getProposalStatus() != ProposalStatus.DRAFT) {
                throw new RuntimeException("Only DRAFT proposals can be edited");
            }
        } else {
            proposal = new ProposalEntity();
            proposal.setProposalStatus(ProposalStatus.DRAFT);
            proposal.setSenderUserId(senderUserId);
            proposal.setReceiverUserId(rq.getReceiverUserId());
            proposal.setRequestId(rq.getRequestId());
        }

        mapRQToEntity(rq, proposal);

        // Business logic: calculate total contract amount
        proposal.setTotalContractAmount(
                proposal.getExpectedQuantity() * proposal.getPricePerUnit()
        );

        return mapEntityToRS(proposalRepository.save(proposal));
    }

    /* -------------------- SEND PROPOSAL -------------------- */
    public void sendProposal(Long senderUserId, Long proposalId) {

        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (!proposal.getSenderUserId().equals(senderUserId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (proposal.getProposalStatus() != ProposalStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT proposals can be sent");
        }

        int totalPercent =
                proposal.getAdvancePercent() +
                        proposal.getMidCyclePercent() +
                        proposal.getFinalPercent();

        if (totalPercent != 100) {
            throw new RuntimeException("Escrow percentages must total 100");
        }

        proposal.setProposalStatus(ProposalStatus.SENT);
        proposal.setValidUntil(LocalDateTime.now().plusDays(7));

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

        proposalRepository.save(proposal);
    }

    /* -------------------- REJECT PROPOSAL -------------------- */
    public void rejectProposal(Long receiverUserId, Long proposalId) {
        ProposalEntity proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        proposal.setProposalStatus(ProposalStatus.REJECTED);

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
                .filter(p -> p.getValidUntil() != null && p.getValidUntil().isAfter(LocalDateTime.now()))
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
        p.setCurrency(rq.getCurrency());

        p.setEscrowApplicable(rq.getEscrowApplicable());
        p.setAdvancePercent(rq.getAdvancePercent());
        p.setMidCyclePercent(rq.getMidCyclePercent());
        p.setFinalPercent(rq.getFinalPercent());

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
                .cropId(p.getCropId())
                .cropSubCategoryId(p.getCropSubCategoryId())
                .contractModel(p.getContractModel() != null ? p.getContractModel().name() : null)
                .season(p.getSeason() != null ? p.getSeason().name() : null)
                .expectedQuantity(p.getExpectedQuantity())
                .unit(p.getUnit() != null ? p.getUnit().name() : null)
                .pricePerUnit(p.getPricePerUnit())
                .currency(p.getCurrency())
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
}
