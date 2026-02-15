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

@Service
@Transactional
public class AgreementServiceImpl implements AgreementService {

    @Autowired
    private ProposalRepo proposalRepo;
    @Autowired
    private AgreementRepo agreementRepo;
    @Autowired
    private AgreementMapper agreementMapper;

    @Autowired
    private EscrowService escrowService;

    @Autowired
    private AgreementEscrowAllocationService allocationService;

    @Autowired
    private BuyerWalletRepository buyerWalletRepo;

    @Autowired
    private SupplyExecutionOrderRepository orderRepo;

    @Autowired
    private NotificationService notificationService;


    //create agreement from proposal
    @Override
    public AgreementRS createAgreement(AgreementCreateRQ rq) {

        ProposalEntity proposal =
                proposalRepo.findById(rq.getProposalId())
                        .orElseThrow(() -> new RuntimeException("Proposal not found"));


        if (proposal.getProposalStatus() != ProposalStatus.FINAL_ACCEPTED) {
            throw new RuntimeException("Agreement can be created only from FINAL_ACCEPTED proposal");
        }

        if (!proposal.getSenderUserId().equals(rq.getUserId()) &&
                !proposal.getReceiverUserId().equals(rq.getUserId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (proposal.getPricePerUnit() == null)
            throw new RuntimeException("Price missing");

        if (proposal.getTotalContractAmount() == null)
            throw new RuntimeException("Total amount missing");

        if (proposal.getDeliveryWindow() == null)
            throw new RuntimeException("Delivery window missing");

        if (proposal.getInputProvided() == null)
            throw new RuntimeException("Input responsibility missing");

        if (proposal.getAllowCropChangeBetweenSeasons() == null)
            throw new RuntimeException("Crop change permission missing");

        if (proposal.getProposalCrops().isEmpty())
            throw new RuntimeException("Crops missing");


        if (agreementRepo.existsByProposalId(proposal.getProposalId())) {
            throw new RuntimeException("Agreement already exists for this proposal");
        }

        Long farmerId =
                proposal.getCreatedByRole().name().equalsIgnoreCase("farmer")
                        ? proposal.getSenderUserId()
                        : proposal.getReceiverUserId();

        Long buyerId =
                farmerId.equals(proposal.getSenderUserId())
                        ? proposal.getReceiverUserId()
                        : proposal.getSenderUserId();

        //BUILD SNAPSHOT
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());

        AgreementSnapshotRS snapshotObj =
                buildSnapshotObject(proposal, farmerId, buyerId);

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
                        "Insufficient wallet balance to create agreement"
                ));


        //create agreement entity
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

        double advance = total * snapshotObj.getAdvancePercent() / 100;
        double mid = total * snapshotObj.getMidCyclePercent() / 100;
        double fin = total * snapshotObj.getFinalPercent() / 100;

        AgreementEscrowAllocation allocation =
                AgreementEscrowAllocation.builder()
                        .agreementId(agreement.getAgreementId())
                        .buyerUserId(buyerId)
                        .totalAllocated(total)
                        .advanceAllocated(advance)
                        .midAllocated(mid)
                        .finalAllocated(fin)
                        .farmerUserId(farmerId)
                        .farmerProfitLocked(total * snapshotObj.getFarmerProfitPercent() / 100)
                        .remainingAgreementEscrow(total)
                        .status(EscrowStatus.LOCKED)
                        .build();

        allocationService.save(allocation);

// FULL CONTRACT LOCK
        escrowService.lockSupplierEscrow(
                agreement.getAgreementId(),
                buyerId,
                total,
                "AGREEMENT_" + agreement.getAgreementId()
        );

        escrowService.lockFarmerProfit(
                buyerId,
                allocation.getFarmerProfitLocked(),
                "AGREEMENT_" + agreement.getAgreementId() + "_FARMER_PROFIT"
        );

        notificationService.notifyUser(
                farmerId,
                NotificationType.AGREEMENT_CREATED,
                "Contract Activated",
                "Your farming agreement is now active",
                agreement.getAgreementId()
        );

        notificationService.notifyUser(
                buyerId,
                NotificationType.AGREEMENT_CREATED,
                "Contract Activated",
                "Agreement created and escrow locked",
                agreement.getAgreementId()
        );
        return agreementMapper.toRS(agreement);
    }

    //get agreement by id
    @Override
    public AgreementRS getAgreement(Long agreementId, Long userId) {

        AgreementEntity agreement =
                agreementRepo.findById(agreementId)
                        .orElseThrow(() -> new RuntimeException("Agreement not found"));

        if (!agreement.getFarmerUserId().equals(userId) &&
                !agreement.getBuyerUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        return agreementMapper.toRS(agreement);
    }

  //list agreements for a user
    @Override
    public List<AgreementListRS> getMyAgreements(Long userId) {

        List<AgreementEntity> agreements =
                agreementRepo.findByFarmerUserIdOrBuyerUserId(userId, userId);

        return agreements.stream().map(a -> {

            AgreementListRS rs = agreementMapper.toListRS(a);

            if (a.getFarmerUserId().equals(userId)) {
                rs.setCounterPartyRole("buyer");
                rs.setCounterPartyName("User-" + a.getBuyerUserId());
            } else {
                rs.setCounterPartyRole("farmer");
                rs.setCounterPartyName("User-" + a.getFarmerUserId());
            }

            return rs;
        }).toList();
    }

  //build agreement snapshot from proposal
  private AgreementSnapshotRS buildSnapshotObject(
          ProposalEntity p,
          Long farmerId,
          Long buyerId
  ) {
      return AgreementSnapshotRS.builder()
              .proposalId(p.getProposalId())
              .proposalVersion(p.getProposalVersion())
              .requestId(p.getRequestId())
              .farmerUserId(farmerId)
              .buyerUserId(buyerId)

              .landId(p.getLandId())
              .landAreaUsed(p.getLandAreaUsed())

              .contractModel(p.getContractModel())
              .season(p.getSeason())
              .startYear(p.getStartYear())
              .endYear(p.getEndYear())

              .pricePerUnit(p.getPricePerUnit())
              .totalContractAmount(p.getTotalContractAmount())
              .escrowApplicable(p.getEscrowApplicable())
              .advancePercent(p.getAdvancePercent())
              .midCyclePercent(p.getMidCyclePercent())
              .finalPercent(p.getFinalPercent())
              .farmerProfitPercent(p.getFarmerProfitPercent())

              .deliveryLocation(p.getDeliveryLocation())
              .deliveryWindow(p.getDeliveryWindow())
              .logisticsHandledBy(p.getLogisticsHandledBy())

              .inputProvided(p.getInputProvided())
              .allowCropChangeBetweenSeasons(p.getAllowCropChangeBetweenSeasons())

              .remarks(p.getRemarks())

              .crops(
                      p.getProposalCrops().stream()
                              .map(c -> AgreementCropSnapshotRS.builder()
                                      .cropId(c.getCropId())
                                      .cropSubCategoryId(c.getCropSubCategoryId())
                                      .season(c.getSeason())
                                      .expectedQuantity(c.getExpectedQuantity())
                                      .unit(c.getUnit())
                                      .landAreaUsed(c.getLandAreaUsed())
                                      .build())
                              .toList()
              )
              .build();
  }

    public void completeAgreement(Long agreementId) {

        List<SupplyExecutionOrderEntity> orders =
                orderRepo.findByAgreementId(agreementId);

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
                alloc.getBuyerUserId(),
                alloc.getFarmerUserId(),
                alloc.getFarmerProfitLocked(),
                "AGREEMENT_COMPLETE_" + agreementId
        );

        alloc.setFarmerProfitLocked(0.0);
        alloc.setStatus(EscrowStatus.CLOSED);
        allocationService.save(alloc);

        AgreementEntity agreement =
                agreementRepo.findById(agreementId).orElseThrow();

        agreement.setStatus(AgreementStatus.COMPLETED);
        agreement.setCompletedAt(LocalDateTime.now());

        agreementRepo.save(agreement);

        notificationService.notifyUser(
                agreement.getFarmerUserId(),
                NotificationType.AGREEMENT_COMPLETED,
                "Farming Completed",
                "All stages finished successfully",
                agreementId
        );

        notificationService.notifyUser(
                agreement.getBuyerUserId(),
                NotificationType.AGREEMENT_COMPLETED,
                "Farming Completed",
                "All stages finished successfully",
                agreementId
        );
    }

}
