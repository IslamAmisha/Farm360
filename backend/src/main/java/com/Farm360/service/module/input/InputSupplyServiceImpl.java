package com.Farm360.service.module.input;

import com.Farm360.dto.request.module.input.InputSupplyApprovalRQ;
import com.Farm360.dto.request.module.input.InputSupplyOrderCreateRQ;
import com.Farm360.dto.request.module.input.InputSupplyProofUploadRQ;
import com.Farm360.dto.response.agreement.AgreementSnapshotRS;
import com.Farm360.dto.response.module.input.InputSupplyApprovalRS;
import com.Farm360.dto.response.module.input.InputSupplyOrderRS;
import com.Farm360.dto.response.module.input.InputSupplyProofRS;
import com.Farm360.mapper.module.input.InputSupplyApprovalMapper;
import com.Farm360.mapper.module.input.InputSupplyOrderMapper;
import com.Farm360.mapper.module.input.InputSupplyProofMapper;
import com.Farm360.model.agreement.AgreementEntity;
import com.Farm360.model.module.input.*;
import com.Farm360.model.payment.AgreementEscrowAllocation;
import com.Farm360.repository.agreement.AgreementRepo;
import com.Farm360.repository.module.input.*;
import com.Farm360.service.agreement.AgreementEscrowAllocationService;
import com.Farm360.service.agreement.AgreementService;
import com.Farm360.service.escrow.EscrowService;
import com.Farm360.utils.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InputSupplyServiceImpl implements InputSupplyService {

    private final AgreementRepo agreementRepo;
    private final InputSupplyOrderRepository orderRepo;
    private final InputSupplyItemRepository itemRepo;
    private final InputSupplyProofRepository proofRepo;
    private final InputSupplyApprovalRepository approvalRepo;

    private final InputSupplyOrderMapper orderMapper;
    private final InputSupplyProofMapper proofMapper;
    private final InputSupplyApprovalMapper approvalMapper;

    private final EscrowService escrowService;

    private final AgreementEscrowAllocationService allocationService;


    @Override
    public InputSupplyOrderRS createOrder(
            Long agreementId,
            InputSupplyOrderCreateRQ rq,
            Long buyerUserId
    ) {

        AgreementEntity agreement = agreementRepo.findById(agreementId)
                .orElseThrow(() -> new RuntimeException("Agreement not found"));

        if (!agreement.getBuyerUserId().equals(buyerUserId)) {
            throw new RuntimeException("Only buyer can initiate input supply");
        }

        if (orderRepo.existsByAgreementIdAndStatusIn(
                agreementId,
                List.of(
                        InputSupplyStatus.PENDING_UPLOAD,
                        InputSupplyStatus.PENDING_APPROVAL
                )

        )) {
            throw new RuntimeException("Input supply already in progress");
        }

        if (rq.getItems() == null || rq.getItems().isEmpty()) {
            throw new RuntimeException("At least one input item required");
        }
        if (agreement.getStatus() != AgreementStatus.SIGNED) {
            throw new RuntimeException("Input supply allowed only for active agreements");
        }


        AgreementSnapshotRS snap = getAgreementSnapshot(agreement);

        AgreementEscrowAllocation allocation =
                allocationService.getByAgreementId(agreementId);

        Double inputAmount = allocation.getAdvanceAllocated();


        InputSupplyOrderEntity order = InputSupplyOrderEntity.builder()
                .agreementId(agreementId)
                .proposalVersion(agreement.getProposalVersion())
                .stage(InputSupplyStage.INITIAL)
                .status(InputSupplyStatus.PENDING_UPLOAD)
                .totalAmount(inputAmount)
                .escrowStatus(InputEscrowStatus.HELD)
                .uploadDueAt(LocalDateTime.now().plusDays(7))
                .attemptCount(0)
                .build();

        if (order.getEscrowStatus() != InputEscrowStatus.HELD) {
            throw new RuntimeException("Escrow already settled");
        }


        order.setItems(
                rq.getItems().stream()
                        .map(i -> InputSupplyItemEntity.builder()
                                .order(order)
                                .inputType(i.getInputType())
                                .brandName(i.getBrandName())
                                .productName(i.getProductName())
                                .quantity(i.getQuantity())
                                .unit(i.getUnit())
                                .expectedPrice(i.getExpectedPrice())
                                .build())
                        .toList()
        );

        orderRepo.save(order);



        return orderMapper.toRS(order);
    }

    @Override
    public InputSupplyProofRS uploadProof(
            Long orderId,
            InputSupplyProofUploadRQ rq,
            Long farmerUserId
    ) {

        InputSupplyOrderEntity order = getOrderOrThrow(orderId);

        if (order.getStatus() != InputSupplyStatus.PENDING_UPLOAD) {
            throw new RuntimeException("Upload not allowed now");
        }

        if (order.getAttemptCount() >= 2) {
            throw new RuntimeException("Maximum attempts exceeded");
        }

        if (order.getUploadDueAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Upload window expired");
        }

        if (order.getEscrowStatus() != InputEscrowStatus.HELD) {
            throw new RuntimeException("Escrow already settled");
        }

        AgreementEntity agreement = agreementRepo.findById(order.getAgreementId())
                .orElseThrow();

        if (!agreement.getFarmerUserId().equals(farmerUserId)) {
            throw new RuntimeException("Only farmer can upload proof");
        }

        int attemptNo = order.getAttemptCount() + 1;

        InputSupplyProofEntity proof = InputSupplyProofEntity.builder()
                .order(order)
                .imageUrl(rq.getImageUrl())
                .geoLat(rq.getGeoLat())
                .geoLng(rq.getGeoLng())
                .remarks(rq.getRemarks())
                .uploadedAt(LocalDateTime.now())
                .attemptNo(attemptNo)
                .build();

        proofRepo.save(proof);

        order.setAttemptCount(order.getAttemptCount());
        order.setStage(InputSupplyStage.INITIAL);
        order.setStatus(InputSupplyStatus.PENDING_APPROVAL);
        order.setApprovalDueAt(LocalDateTime.now().plusDays(7));

        orderRepo.save(order);

        return proofMapper.toRS(proof);
    }

    @Override
    public InputSupplyApprovalRS approveOrReject(
            Long orderId,
            InputSupplyApprovalRQ rq,
            Long buyerUserId
    ) {

        InputSupplyOrderEntity order = getOrderOrThrow(orderId);

        if (order.getApprovalDueAt() != null &&
                order.getApprovalDueAt().isBefore(LocalDateTime.now())) {

            if (order.getStatus() != InputSupplyStatus.PENDING_APPROVAL) {
                throw new RuntimeException("Order is not awaiting approval");
            }

            if (order.getEscrowStatus() != InputEscrowStatus.HELD) {
                throw new RuntimeException("Escrow already settled");
            }

            AgreementEntity agreement = agreementRepo.findById(order.getAgreementId())
                    .orElseThrow();

            order.setStatus(InputSupplyStatus.AUTO_APPROVED);
            order.setEscrowStatus(InputEscrowStatus.RELEASED);
            order.setApprovalDueAt(null);
            order.setSystemRemark("Auto approved due to buyer inactivity");

            orderRepo.save(order);

            return approvalMapper.toRS(
                    InputSupplyApprovalEntity.builder()
                            .order(order)
                            .approved(true)
                            .reason("Auto-approved (buyer inactive)")
                            .build()
            );
        }

        AgreementEntity agreement = agreementRepo.findById(order.getAgreementId())
                .orElseThrow();

        if (!agreement.getBuyerUserId().equals(buyerUserId)) {
            throw new RuntimeException("Only buyer can approve or reject");
        }

        if (!rq.getApproved() &&
                (rq.getReason() == null || rq.getReason().isBlank())) {
            throw new RuntimeException("Rejection reason required");
        }

        InputSupplyApprovalEntity approval =
                InputSupplyApprovalEntity.builder()
                        .order(order)
                        .approved(rq.getApproved())
                        .reason(rq.getReason())
                        .build();

        approvalRepo.save(approval);

        if (rq.getApproved()) {

            order.setStatus(InputSupplyStatus.APPROVED);
            order.setEscrowStatus(InputEscrowStatus.RELEASED);
            order.setApprovalDueAt(null);


        } else {

            if (order.getAttemptCount() >= 2) {

                order.setStatus(InputSupplyStatus.FAILED);
                order.setEscrowStatus(InputEscrowStatus.REFUNDED);
                order.setApprovalDueAt(null);



            } else {

                order.setStage(InputSupplyStage.INITIAL);
                order.setStatus(InputSupplyStatus.PENDING_UPLOAD);
                order.setUploadDueAt(LocalDateTime.now().plusDays(7));
                order.setApprovalDueAt(null);
            }
        }

        orderRepo.save(order);

        return approvalMapper.toRS(approval);
    }

    @Override
    public InputSupplyOrderRS getOrder(Long orderId, Long userId) {

        InputSupplyOrderEntity order = getOrderOrThrow(orderId);

        AgreementEntity agreement = agreementRepo.findById(order.getAgreementId())
                .orElseThrow();

        if (!agreement.getBuyerUserId().equals(userId)
                && !agreement.getFarmerUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        return orderMapper.toRS(order);
    }

    @Override
    public List<InputSupplyOrderRS> getOrdersByAgreement(Long agreementId) {

        return orderRepo.findByAgreementId(agreementId)
                .stream()
                .map(orderMapper::toRS)
                .toList();
    }

    private InputSupplyOrderEntity getOrderOrThrow(Long orderId) {
        return orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Input supply order not found"));
    }

    private AgreementSnapshotRS getAgreementSnapshot(AgreementEntity agreement) {

        if (agreement.getAgreementSnapshot() == null) {
            throw new RuntimeException("Agreement snapshot missing");
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            return mapper.readValue(
                    agreement.getAgreementSnapshot(),
                    AgreementSnapshotRS.class
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse agreement snapshot", e);
        }
    }

}
