package com.Farm360.service.proposal;

import com.Farm360.model.proposal.ProposalActionHistoryEntity;
import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.repository.proposal.ProposalActionHistoryRepo;
import com.Farm360.repository.proposal.ProposalRepo;
import com.Farm360.service.notification.NotificationService;
import com.Farm360.utils.NotificationType;
import com.Farm360.utils.ProposalActionType;
import com.Farm360.utils.ProposalStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class ProposalExpirySchedulerImpl implements ProposalExpiryScheduler {

    @Autowired
    private ProposalRepo proposalRepo;

    @Autowired
    private ProposalActionHistoryRepo actionHistoryRepo;

    @Autowired
    private NotificationService notificationService;


    @Override
    @Scheduled(cron = "0 */10 * * * *") // runs every 10 minutes
    public void expireProposals() {
        LocalDateTime now = LocalDateTime.now();

        List<ProposalEntity> expiredProposals =
                proposalRepo.findByProposalStatusInAndActionDueAtBefore(
                        List.of(ProposalStatus.SENT),
                        now
                );

        if (expiredProposals.isEmpty()) {
            return;
        }

        for (ProposalEntity proposal : expiredProposals) {
            proposal.setProposalStatus(ProposalStatus.EXPIRED);

            notificationService.notifyUser(
                    proposal.getSenderUserId(),
                    NotificationType.PROPOSAL_EXPIRED,
                    "Proposal Expired",
                    "No action taken. Proposal expired.",
                    proposal.getProposalId()
            );

            notificationService.notifyUser(
                    proposal.getReceiverUserId(),
                    NotificationType.PROPOSAL_EXPIRED,
                    "Proposal Expired",
                    "No action taken. Proposal expired.",
                    proposal.getProposalId()
            );
            proposal.setExpiredAt(now);
            proposal.setLocked(true);
            actionHistoryRepo.save(
                    ProposalActionHistoryEntity.builder()
                            .proposalId(proposal.getProposalId())
                            .proposalVersion(proposal.getProposalVersion())
                            .actionBy(proposal.getActionRequiredBy())
                            .actionType(ProposalActionType.EXPIRE)
                            .actionAt(now)
                            .remarks("Proposal expired due to no action")
                            .build()
            );

        }

        proposalRepo.saveAll(expiredProposals);

        log.info("Expired {} proposals", expiredProposals.size());
    }
}
