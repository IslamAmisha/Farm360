package com.Farm360.service.agreement;

import com.Farm360.dto.response.agreement.AgreementResponseDTO;
import com.Farm360.dto.response.agreement.AgreementSummaryDTO;
import com.Farm360.mapper.agreement.AgreementMapper;
import com.Farm360.model.agreement.AgreementEntity;
import com.Farm360.model.payment.BuyerWallet;
import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.repository.agreement.AgreementRepo;

import com.Farm360.repository.payment.BuyerWalletRepository;
import com.Farm360.repository.proposal.ProposalRepo;

import com.Farm360.utils.AgreementStatus;
import com.Farm360.utils.ProposalStatus;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AgreementServiceImpl implements AgreementService {

//    private final AgreementRepo agreementRepository;
//    private final ProposalRepo proposalRepository;
//    private final BuyerWalletRepository buyerWalletRepository;
//
//    public AgreementServiceImpl(
//            AgreementRepo agreementRepository,
//            ProposalRepo proposalRepository,
//            BuyerWalletRepository buyerWalletRepository
//    ) {
//        this.agreementRepository = agreementRepository;
//        this.proposalRepository = proposalRepository;
//        this.buyerWalletRepository = buyerWalletRepository;
//    }
//
//    // ==================================================
//    // Create Agreement
//    // ==================================================
//    @Override
//    public AgreementResponseDTO createAgreementFromProposal(Long proposalId) {
//
//        ProposalEntity proposal = proposalRepository.findById(proposalId)
//                .orElseThrow(() -> new IllegalStateException("Proposal not found"));
//
//        if (proposal.getProposalStatus() != ProposalStatus.ACCEPTED) {
//            throw new IllegalStateException("Only accepted proposals can create agreements");
//        }
//
//        agreementRepository.findByProposalId(proposalId)
//                .ifPresent(a -> {
//                    throw new IllegalStateException("Agreement already exists for this proposal");
//                });
//
//        Long buyerId = proposal.getReceiverUserId();
//        Long farmerId = proposal.getSenderUserId();
//
//        BuyerWallet wallet = buyerWalletRepository
//                .findByBuyerIdForUpdate(buyerId)
//                .orElseThrow(() -> new IllegalStateException("Buyer wallet not found"));
//
//        BigDecimal availableBalance =
//                BigDecimal.valueOf(wallet.getBalance() - wallet.getLockedAmount());
//        BigDecimal requiredAmount =
//                BigDecimal.valueOf(proposal.getTotalContractAmount());
//
//
//        if (availableBalance.compareTo(requiredAmount) < 0) {
//            throw new IllegalStateException(
//                    "Buyer wallet balance insufficient for agreement creation"
//            );
//        }
//
//        AgreementEntity agreement = new AgreementEntity();
//        agreement.setProposalId(proposal.getProposalId());
//        agreement.setRequestId(proposal.getRequestId());
//        agreement.setBuyerId(buyerId);
//        agreement.setFarmerId(farmerId);
//        agreement.setTotalContractAmount(requiredAmount);
//        agreement.setStatus(AgreementStatus.ACTIVE);
//        agreement.setStartDate(LocalDateTime.now());
//
//        AgreementEntity savedAgreement = agreementRepository.save(agreement);
//
//        return AgreementMapper.toResponse(savedAgreement);
//    }
//
//    // ==================================================
//    // Get by Proposal ID
//    // ==================================================
//    @Override
//    public AgreementResponseDTO getByProposalId(Long proposalId) {
//        AgreementEntity agreement = agreementRepository.findByProposalId(proposalId)
//                .orElseThrow(() -> new IllegalStateException("Agreement not found"));
//
//        return AgreementMapper.toResponse(agreement);
//    }
//
//    // ==================================================
//    // Buyer Agreements
//    // ==================================================
//    @Override
//    public List<AgreementSummaryDTO> getByBuyerId(Long buyerId) {
//        return agreementRepository.findByBuyerId(buyerId)
//                .stream()
//                .map(a -> AgreementMapper.toSummary(a, a.getFarmerId()))
//                .collect(Collectors.toList());
//    }
//
//    // ==================================================
//    // Farmer Agreements
//    // ==================================================
//    @Override
//    public List<AgreementSummaryDTO> getByFarmerId(Long farmerId) {
//        return agreementRepository.findByFarmerId(farmerId)
//                .stream()
//                .map(a -> AgreementMapper.toSummary(a, a.getBuyerId()))
//                .collect(Collectors.toList());
//    }
//
//    // ==================================================
//    // Terminate Agreement
//    // ==================================================
//    @Override
//    public AgreementResponseDTO terminateAgreement(Long agreementId) {
//
//        AgreementEntity agreement = agreementRepository.findById(agreementId)
//                .orElseThrow(() -> new IllegalStateException("Agreement not found"));
//
//        if (agreement.getStatus() == AgreementStatus.TERMINATED) {
//            throw new IllegalStateException("Agreement already terminated");
//        }
//
//        agreement.setStatus(AgreementStatus.TERMINATED);
//        agreement.setEndDate(LocalDateTime.now());
//
//        AgreementEntity saved = agreementRepository.save(agreement);
//
//        return AgreementMapper.toResponse(saved);
//    }
//}
}