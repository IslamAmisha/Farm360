package com.Farm360.service.proposal;

import com.Farm360.dto.response.proposal.ProposalActionRS;
import com.Farm360.dto.response.proposal.ProposalHistoryRS;
import com.Farm360.dto.response.proposal.ProposalListRS;
import com.Farm360.dto.response.proposal.ProposalVersionHistoryRS;
import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.repository.proposal.ProposalActionHistoryRepo;
import com.Farm360.repository.proposal.ProposalRepo;
import com.Farm360.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProposalDashboardServiceImpl implements ProposalDashboardService {

    @Autowired
    private ProposalRepo proposalRepo;
    @Autowired
    private ProposalActionHistoryRepo actionHistoryRepo;
    @Autowired
    private ProposalService proposalService;

    @Override
    public List<ProposalListRS> getMyProposals(Long userId, Role role) {

        List<ProposalEntity> all =
                proposalRepo.findAllByUser(userId);

        // group by requestId → pick latest version
        Map<Long, ProposalEntity> latestPerRequest =
                all.stream()
                        .collect(Collectors.toMap(
                                ProposalEntity::getRequestId,
                                p -> p,
                                (p1, p2) ->
                                        p1.getProposalVersion() > p2.getProposalVersion()
                                                ? p1 : p2
                        ));

        return latestPerRequest.values().stream()
                .map(p -> ProposalListRS.builder()
                        .proposalId(p.getProposalId())
                        .requestId(p.getRequestId())
                        .latestVersion(p.getProposalVersion())
                        .proposalStatus(p.getProposalStatus().name())
                        .actionRequiredBy(
                                p.getActionRequiredBy() != null
                                        ? p.getActionRequiredBy().name()
                                        : null
                        )
                        .expiresOn(p.getActionDueAt())
                        .locked(p.getLocked())
                        .lastUpdatedAt(
                                p.getModifiedDate()
                                        .toInstant()
                                        .atZone(ZoneId.of("Asia/Kolkata"))
                                        .toLocalDateTime()
                        )
                        .counterPartyRole(
                                p.getSenderUserId().equals(userId)
                                        ? p.getActionRequiredBy() != null
                                        ? p.getActionRequiredBy().name()
                                        : null
                                        : p.getCreatedByRole().name()
                        )
                        .counterPartyName(
                                p.getSenderUserId().equals(userId)
                                        ? "User-" + p.getReceiverUserId()
                                        : "User-" + p.getSenderUserId()
                        )
                        .build()
                )
                .sorted(Comparator.comparing(ProposalListRS::getLastUpdatedAt).reversed())
                .collect(Collectors.toList());
    }

   //proposal history
    @Override
    public ProposalHistoryRS getProposalHistory(Long requestId, Long userId) {

        List<ProposalEntity> versions =
                proposalRepo.findByRequestIdOrderByProposalVersionAsc(requestId);

        if (versions.isEmpty()) {
            throw new RuntimeException("No proposal history found");
        }

        // authorization check
        boolean allowed =
                versions.stream().anyMatch(p ->
                        p.getSenderUserId().equals(userId)
                                || p.getReceiverUserId().equals(userId)
                );

        if (!allowed) {
            throw new RuntimeException("Unauthorized");
        }

        List<ProposalVersionHistoryRS> history =
                versions.stream().map(p -> {

                    List<ProposalActionRS> actions =
                            actionHistoryRepo
                                    .findByProposalIdOrderByActionAtAsc(p.getProposalId())
                                    .stream()
                                    .map(a -> ProposalActionRS.builder()
                                            .actionType(a.getActionType().name())
                                            .actionBy(a.getActionBy().name())
                                            .actionAt(a.getActionAt())
                                            .remarks(a.getRemarks())
                                            .build()
                                    )
                                    .collect(Collectors.toList());

                    return ProposalVersionHistoryRS.builder()
                            .proposalId(p.getProposalId())
                            .proposalVersion(p.getProposalVersion())
                            .createdByRole(p.getCreatedByRole().name())
                            .proposalStatus(p.getProposalStatus().name())
                            .proposalData(
                                    proposalService.getProposalById(userId, p.getProposalId())
                            )
                            .actions(actions)
                            .build();
                }).collect(Collectors.toList());

        ProposalEntity last = versions.get(versions.size() - 1);

        return ProposalHistoryRS.builder()
                .requestId(requestId)
                .rootProposalId(versions.get(0).getProposalId())
                .finalStatus(last.getProposalStatus().name())
                .versions(history)
                .build();
    }
}
