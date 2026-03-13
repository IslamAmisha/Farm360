package com.Farm360.service.agreement;

import com.Farm360.dto.request.agreement.AgreementCreateRQ;
import com.Farm360.dto.response.agreement.AgreementCropSnapshotRS;
import com.Farm360.dto.response.agreement.AgreementListRS;
import com.Farm360.dto.response.agreement.AgreementRS;
import com.Farm360.dto.response.agreement.AgreementSnapshotRS;
import com.Farm360.mapper.agreement.AgreementMapper;
import com.Farm360.model.agreement.AgreementEntity;
import com.Farm360.model.payment.AgreementEscrowAllocation;
import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.model.supply.SupplyExecutionOrderEntity;
import com.Farm360.repository.agreement.AgreementRepo;
import com.Farm360.repository.buyer.BuyerRepo;
import com.Farm360.repository.farmer.FarmerRepo;
import com.Farm360.repository.master.CropRepo;
import com.Farm360.repository.master.CropSubCategoriesRepo;
import com.Farm360.repository.payment.BuyerWalletRepository;
import com.Farm360.repository.proposal.ProposalRepo;
import com.Farm360.repository.supply.SupplyExecutionOrderRepository;
import com.Farm360.service.escrow.EscrowService;
import com.Farm360.service.notification.NotificationService;
import com.Farm360.utils.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
public class AgreementServiceImpl implements AgreementService {

    @Autowired private ProposalRepo proposalRepo;
    @Autowired private AgreementRepo agreementRepo;
    @Autowired private AgreementMapper agreementMapper;
    @Autowired private EscrowService escrowService;
    @Autowired private AgreementEscrowAllocationService allocationService;
    @Autowired private BuyerWalletRepository buyerWalletRepo;
    @Autowired private SupplyExecutionOrderRepository orderRepo;
    @Autowired private NotificationService notificationService;

    @Autowired private CropRepo cropRepo;
    @Autowired private CropSubCategoriesRepo cropSubCategoryRepo;

    @Autowired private FarmerRepo farmerProfileRepo;
    @Autowired private BuyerRepo buyerProfileRepo;

    @Override
    public AgreementRS createAgreement(AgreementCreateRQ rq) {

        ProposalEntity proposal =
                proposalRepo.findById(rq.getProposalId())
                        .orElseThrow(() -> new RuntimeException("Proposal not found"));

        if (proposal.getProposalStatus() != ProposalStatus.FINAL_ACCEPTED)
            throw new RuntimeException("Agreement can be created only from FINAL_ACCEPTED proposal");

        if (!proposal.getSenderUserId().equals(rq.getUserId()) &&
                !proposal.getReceiverUserId().equals(rq.getUserId()))
            throw new RuntimeException("Unauthorized");

        if (proposal.getPricePerUnit() == null)
            throw new RuntimeException("Price missing");
        if (proposal.getTotalContractAmount() == null)
            throw new RuntimeException("Total amount missing");
        if (proposal.getDeliveryWindow() == null)
            throw new RuntimeException("Delivery window missing");
        if (proposal.getProposalCrops().isEmpty())
            throw new RuntimeException("Crops missing");

        if (agreementRepo.existsByProposalId(proposal.getProposalId()))
            throw new RuntimeException("Agreement already exists for this proposal");

        Long farmerId =
                proposal.getCreatedByRole().name().equalsIgnoreCase("farmer")
                        ? proposal.getSenderUserId()
                        : proposal.getReceiverUserId();

        Long buyerId =
                farmerId.equals(proposal.getSenderUserId())
                        ? proposal.getReceiverUserId()
                        : proposal.getSenderUserId();

        AgreementSnapshotRS snapshotObj = buildSnapshotObject(proposal, farmerId, buyerId);

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        String snapshotJson;
        try {
            snapshotJson = mapper.writeValueAsString(snapshotObj);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create agreement snapshot", e);
        }

        double total = snapshotObj.getTotalContractAmount();
        buyerWalletRepo.findByBuyerUserIdForUpdate(buyerId)
                .filter(w -> w.getBalance() >= total)
                .orElseThrow(() -> new RuntimeException(
                        "Insufficient wallet balance to create agreement"));

        AgreementEntity agreement = AgreementEntity.builder()
                .proposalId(proposal.getProposalId())
                .proposalVersion(proposal.getProposalVersion())
                .requestId(proposal.getRequestId())
                .farmerUserId(farmerId)
                .buyerUserId(buyerId)
                .status(AgreementStatus.SIGNED)
                .signedAt(LocalDateTime.now())
                .agreementSnapshot(snapshotJson)
                .locked(true)
                .build();

        agreementRepo.save(agreement);

        double advance = total * snapshotObj.getAdvancePercent() / 100.0;
        double mid     = total * snapshotObj.getMidCyclePercent() / 100.0;
        double fin     = total * snapshotObj.getFinalPercent() / 100.0;

        AgreementEscrowAllocation allocation =
                AgreementEscrowAllocation.builder()
                        .agreementId(agreement.getAgreementId())
                        .buyerUserId(buyerId)
                        .farmerUserId(farmerId)
                        .totalAllocated(total)
                        .advanceAllocated(advance)
                        .advanceReleased(0.0)
                        .midAllocated(mid)
                        .midReleased(0.0)
                        .finalAllocated(fin)
                        .finalReleased(0.0)
                        .farmerProfitLocked(total * snapshotObj.getFarmerProfitPercent() / 100.0)
                        .remainingAgreementEscrow(total)
                        .status(EscrowStatus.LOCKED)
                        .build();

        allocationService.save(allocation);

        escrowService.lockSupplierEscrow(
                agreement.getAgreementId(), buyerId, total,
                "AGREEMENT_" + agreement.getAgreementId());

        escrowService.lockFarmerProfit(
                buyerId, allocation.getFarmerProfitLocked(),
                "AGREEMENT_" + agreement.getAgreementId() + "_FARMER_PROFIT");

        notificationService.notifyUser(farmerId, NotificationType.AGREEMENT_CREATED,
                "Contract Activated", "Your farming agreement is now active",
                agreement.getAgreementId());

        notificationService.notifyUser(buyerId, NotificationType.AGREEMENT_CREATED,
                "Contract Activated", "Agreement created and escrow locked",
                agreement.getAgreementId());

        return agreementMapper.toRS(agreement);
    }

    @Override
    public AgreementRS getAgreement(Long agreementId, Long userId) {

        AgreementEntity agreement =
                agreementRepo.findById(agreementId)
                        .orElseThrow(() -> new RuntimeException("Agreement not found"));

        if (!agreement.getFarmerUserId().equals(userId) &&
                !agreement.getBuyerUserId().equals(userId))
            throw new RuntimeException("Unauthorized");

        return agreementMapper.toRS(agreement);
    }

    @Override
    public AgreementRS getAgreementByProposalId(Long proposalId, Long userId) {

        AgreementEntity agreement =
                agreementRepo.findByProposalId(proposalId)
                        .orElseThrow(() -> new RuntimeException("Agreement not found for proposal"));

        if (!agreement.getFarmerUserId().equals(userId) &&
                !agreement.getBuyerUserId().equals(userId))
            throw new RuntimeException("Unauthorized");

        return agreementMapper.toRS(agreement);
    }

    @Override
    public List<AgreementListRS> getMyAgreements(Long userId) {

        return agreementRepo.findByFarmerUserIdOrBuyerUserId(userId, userId)
                .stream()
                .map(a -> {
                    AgreementListRS rs = agreementMapper.toListRS(a);
                    rs.setProposalVersion(a.getProposalVersion());

                    if (a.getFarmerUserId().equals(userId)) {
                        String buyerName = buyerProfileRepo.findByUserId(a.getBuyerUserId())
                                .map(b -> b.getFullName() != null ? b.getFullName() : b.getBusinessName())
                                .orElse("Buyer #" + a.getBuyerUserId());

                        rs.setCounterPartyRole("buyer");
                        rs.setCounterPartyId(a.getBuyerUserId());
                        rs.setCounterPartyName(buyerName);

                    } else {
                        String farmerName = farmerProfileRepo.findByUserId(a.getFarmerUserId())
                                .map(f -> f.getFarmerName() != null ? f.getFarmerName() : "Farmer #" + a.getFarmerUserId())
                                .orElse("Farmer #" + a.getFarmerUserId());

                        rs.setCounterPartyRole("farmer");
                        rs.setCounterPartyId(a.getFarmerUserId());
                        rs.setCounterPartyName(farmerName);
                    }

                    return rs;
                })
                .toList();
    }


    private AgreementSnapshotRS buildSnapshotObject(
            ProposalEntity p,
            Long farmerId,
            Long buyerId
    ) {
        /* ── Farmer ── */
        String farmerName     = "—";
        String farmerLocation = "—";
        try {
            var fp = farmerProfileRepo.findByUserId(farmerId).orElse(null);
            if (fp != null) {
                farmerName     = firstNonBlank(fp.getFarmerName());
                farmerLocation = joinParts(
                        fp.getVillage(),
                        fp.getBlock()    != null ? fp.getBlock().getName()    : null,
                        fp.getDistrict() != null ? fp.getDistrict().getName() : null
                );
            }
        } catch (Exception ignored) {}

        /* ── Buyer ── */
        String buyerName         = "—";
        String buyerBusinessName = "—";
        String buyerLocation     = "—";
        try {
            var bp = buyerProfileRepo.findByUserId(buyerId).orElse(null);
            if (bp != null) {
                buyerName         = firstNonBlank(bp.getFullName());
                buyerBusinessName = firstNonBlank(bp.getBusinessName());
                buyerLocation     = joinParts(
                        bp.getCity()     != null ? bp.getCity().getName()     : null,
                        bp.getDistrict() != null ? bp.getDistrict().getName() : null,
                        bp.getBlock()    != null ? bp.getBlock().getName()    : null
                );
            }
        } catch (Exception ignored) {}

        /* ── Crops with resolved names ── */
        var crops = p.getProposalCrops().stream()
                .map(c -> {
                    String cropName   = "—";
                    String subCatName = "—";
                    try {
                        var crop = cropRepo.findById(c.getCropId()).orElse(null);
                        if (crop != null) cropName = crop.getName();
                    } catch (Exception ignored) {}
                    try {
                        if (c.getCropSubCategoryId() != null) {
                            var sub = cropSubCategoryRepo.findById(c.getCropSubCategoryId()).orElse(null);
                            if (sub != null) subCatName = sub.getName();
                        }
                    } catch (Exception ignored) {}

                    return AgreementCropSnapshotRS.builder()
                            .cropId(c.getCropId())
                            .cropName(cropName)
                            .cropSubCategoryId(c.getCropSubCategoryId())
                            .cropSubCategoryName(subCatName)
                            .season(c.getSeason())
                            .expectedQuantity(c.getExpectedQuantity())
                            .unit(c.getUnit())
                            .landAreaUsed(c.getLandAreaUsed())
                            .build();
                })
                .toList();

        return AgreementSnapshotRS.builder()
                .proposalId(p.getProposalId())
                .proposalVersion(p.getProposalVersion())
                .requestId(p.getRequestId())

                .farmerUserId(farmerId)
                .farmerName(farmerName)
                .farmerLocation(farmerLocation)

                .buyerUserId(buyerId)
                .buyerName(buyerName)
                .buyerBusinessName(buyerBusinessName)
                .buyerLocation(buyerLocation)

                .landId(p.getLandId())
                .landAreaUsed(p.getLandAreaUsed())

                .contractModel(p.getContractModel())
                .season(p.getSeason())
                .startYear(p.getStartYear())
                .endYear(p.getEndYear())

                .pricePerUnit(p.getPricePerUnit())
                .totalContractAmount(p.getTotalContractAmount())
                .advancePercent(p.getAdvancePercent())
                .midCyclePercent(p.getMidCyclePercent())
                .finalPercent(p.getFinalPercent())
                .farmerProfitPercent(p.getFarmerProfitPercent())

                .deliveryLocation(p.getDeliveryLocation())
                .deliveryWindow(p.getDeliveryWindow())
                .logisticsHandledBy(p.getLogisticsHandledBy())

                .remarks(p.getRemarks())
                .crops(crops)

                // FIX: freeze the negotiated tolerance into the snapshot so
                // autoApproveAndRelease reads the correct value from JSON
                .billToleranceType(p.getBillToleranceType())
                .billToleranceValue(p.getBillToleranceValue())

                .build();
    }

    public void completeAgreement(Long agreementId) {

        List<SupplyExecutionOrderEntity> orders =
                orderRepo.findByAgreement_AgreementId(agreementId);

        boolean allApproved = orders.stream()
                .allMatch(o -> o.getStatus() == SupplyStatus.APPROVED);

        if (!allApproved)
            throw new RuntimeException("All stages not completed");

        releaseFarmerProfit(agreementId);
    }

    private void releaseFarmerProfit(Long agreementId) {

        AgreementEscrowAllocation alloc =
                allocationService.getByAgreementId(agreementId);

        escrowService.releaseFarmerProfit(
                alloc.getBuyerUserId(), alloc.getFarmerUserId(),
                alloc.getFarmerProfitLocked(),
                "AGREEMENT_COMPLETE_" + agreementId);

        alloc.setFarmerProfitLocked(0.0);
        alloc.setStatus(EscrowStatus.CLOSED);
        allocationService.save(alloc);

        AgreementEntity agreement =
                agreementRepo.findById(agreementId).orElseThrow();

        agreement.setStatus(AgreementStatus.COMPLETED);
        agreement.setCompletedAt(LocalDateTime.now());
        agreementRepo.save(agreement);

        notificationService.notifyUser(agreement.getFarmerUserId(),
                NotificationType.AGREEMENT_COMPLETED,
                "Farming Completed", "All stages finished successfully", agreementId);

        notificationService.notifyUser(agreement.getBuyerUserId(),
                NotificationType.AGREEMENT_COMPLETED,
                "Farming Completed", "All stages finished successfully", agreementId);
    }

    private String joinParts(String... parts) {
        String r = Stream.of(parts)
                .filter(s -> s != null && !s.isBlank())
                .collect(Collectors.joining(", "));
        return r.isBlank() ? "—" : r;
    }

    private String firstNonBlank(String... values) {
        for (String v : values) if (v != null && !v.isBlank()) return v;
        return "—";
    }
}