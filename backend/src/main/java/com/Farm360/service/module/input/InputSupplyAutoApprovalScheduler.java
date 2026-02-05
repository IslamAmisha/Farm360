package com.Farm360.service.module.input;

import com.Farm360.model.agreement.AgreementEntity;
import com.Farm360.model.module.input.InputSupplyOrderEntity;
import com.Farm360.repository.agreement.AgreementRepo;
import com.Farm360.repository.module.input.InputSupplyOrderRepository;
import com.Farm360.service.escrow.EscrowService;
import com.Farm360.utils.EscrowPurpose;
import com.Farm360.utils.InputEscrowStatus;
import com.Farm360.utils.InputSupplyStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InputSupplyAutoApprovalScheduler {

    private final InputSupplyOrderRepository orderRepo;
    private final AgreementRepo agreementRepo;
    private final EscrowService escrowService;

    @Scheduled(cron = "0 */30 * * * *") // every 30 min
    @Transactional
    public void autoApproveExpiredInputs() {

        List<InputSupplyOrderEntity> orders =
                orderRepo.findByStatusAndApprovalDueAtBefore(
                        InputSupplyStatus.PENDING_APPROVAL,
                        LocalDateTime.now()
                );

        for (InputSupplyOrderEntity order : orders) {

            if (order.getEscrowStatus() != InputEscrowStatus.HELD) continue;

            AgreementEntity agreement =
                    agreementRepo.findById(order.getAgreementId())
                            .orElseThrow();

            order.setStatus(InputSupplyStatus.AUTO_APPROVED);
            order.setEscrowStatus(InputEscrowStatus.RELEASED);
            order.setSystemRemark("Auto approved due to buyer inactivity");
            order.setApprovalDueAt(null);

            escrowService.releaseForAgreement(
                    agreement.getAgreementId(),
                    agreement.getBuyerUserId(),
                    agreement.getFarmerUserId(),
                    order.getTotalAmount(),
                    EscrowPurpose.INPUT_SUPPLY,
                    "INPUT_SUPPLY_" + order.getId()
            );
        }
    }
}
