package com.Farm360.service.proposal;

import com.Farm360.dto.request.proposal.ProposalCoordinationExpectationRQ;
import com.Farm360.dto.response.proposal.ProposalCoordinationExpectationRS;
import com.Farm360.mapper.proposal.ProposalCoordinationExpectationMapper;
import com.Farm360.model.proposal.ProposalCoordinationExpectationEntity;
import com.Farm360.model.proposal.ProposalEntity;
import com.Farm360.repository.proposal.ProposalCoordinationExpectationRepository;
import com.Farm360.repository.proposal.ProposalRepo;
import com.Farm360.utils.Role;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProposalCoordinationExpectationServiceImpl
        implements ProposalCoordinationExpectationService {

    private final ProposalRepo proposalRepo;
    private final ProposalCoordinationExpectationRepository coordinationRepo;

    @Override
    public ProposalCoordinationExpectationRS upsertExpectation(
            Long proposalId,
            ProposalCoordinationExpectationRQ rq,
            Long actingUserId,
            Role actingRole
    ) {

        ProposalEntity proposal = proposalRepo.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        /* ---------------- VALIDATION ---------------- */

        // Only the party whose turn it is may counter
        if (proposal.getActionRequiredBy() != actingRole) {
            throw new RuntimeException("You are not allowed to modify coordination terms now");
        }

        // Find existing active expectation (if any)
        coordinationRepo
                .findByProposalAndSubjectAndActiveTrue(proposal, rq.getSubject())
                .ifPresent(existing -> {
                    existing.setActive(false);
                    coordinationRepo.save(existing);
                });

        /* ---------------- ENTITY BUILD ---------------- */

        Duration expectedWithin = rq.getExpectedWithin();

        ProposalCoordinationExpectationEntity entity =
                ProposalCoordinationExpectationEntity.builder()
                        .proposal(proposal)
                        .proposalVersion(proposal.getProposalVersion())
                        .subject(rq.getSubject())
                        .coordinationType(rq.getCoordinationType())
                        .actionRequiredBy(rq.getActionRequiredBy())
                        .expectedWithin(expectedWithin)
                        .note(rq.getNote())
                        .active(true)
                        .build();

        coordinationRepo.save(entity);

        /* ---------------- TURN FLIP ---------------- */

        proposal.setActionRequiredBy(
                actingRole == Role.buyer ? Role.farmer : Role.buyer
        );

        proposalRepo.save(proposal);

        /* ---------------- RESPONSE ---------------- */

        return ProposalCoordinationExpectationMapper.toRS(entity);
    }
    @Override
    public List<ProposalCoordinationExpectationRS> getExpectations(
            Long proposalId
    ) {
        return getAllForProposal(proposalId);
    }

    @Override
    public List<ProposalCoordinationExpectationRS> getAllForProposal(
            Long proposalId
    ) {
        ProposalEntity proposal = proposalRepo.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found"));

        return coordinationRepo.findByProposal(proposal)
                .stream()
                .map(ProposalCoordinationExpectationMapper::toRS)
                .toList();
    }
}
