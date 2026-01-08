package com.Farm360.service.proposal;

import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.repository.proposal.ProposalRepo;
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

    @Override
    @Scheduled(cron = "0 */10 * * * *") // runs every 10 minutes
    public void expireProposals() {
        LocalDateTime now = LocalDateTime.now();

        List<ProposalEntity> expiredProposals =
                proposalRepo.findByProposalStatusInAndActionDueAtBefore(
                        List.of(ProposalStatus.DRAFT, ProposalStatus.SENT),
                        now
                );

        if (expiredProposals.isEmpty()) {
            return;
        }

        for (ProposalEntity proposal : expiredProposals) {
            proposal.setProposalStatus(ProposalStatus.EXPIRED);
            proposal.setExpiredAt(now);
            proposal.setLocked(true);
        }

        proposalRepo.saveAll(expiredProposals);

        log.info("Expired {} proposals", expiredProposals.size());
    }
}
