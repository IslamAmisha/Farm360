package com.Farm360.controller.proposal;

import com.Farm360.dto.request.proposal.ProposalCoordinationExpectationRQ;
import com.Farm360.dto.response.proposal.ProposalCoordinationExpectationRS;
import com.Farm360.service.proposal.ProposalCoordinationExpectationService;
import com.Farm360.utils.Role;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Handles coordination negotiation (deadlines / platform update expectations)
 * Parallel to business clause negotiation in proposal module.
 */
@RestController
@RequestMapping("/api/proposals/{proposalId}/coordination")
@RequiredArgsConstructor
public class ProposalCoordinationExpectationController {

    private final ProposalCoordinationExpectationService coordinationService;

    /**
     * Upsert a coordination expectation (create or counter)
     * Only the party whose turn it is may perform this action.
     */
    @PostMapping
    public ResponseEntity<ProposalCoordinationExpectationRS> upsertExpectation(
            @PathVariable Long proposalId,
            @RequestBody @Valid ProposalCoordinationExpectationRQ rq,
            @RequestHeader("X-User-Id") Long actingUserId,
            @RequestHeader("X-User-Role") Role actingRole
    ) {
        ProposalCoordinationExpectationRS response =
                coordinationService.upsertExpectation(proposalId, rq, actingUserId, actingRole);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * Get all coordination expectations for a proposal (history)
     */
    @GetMapping("/history")
    public ResponseEntity<List<ProposalCoordinationExpectationRS>> getAllExpectations(
            @PathVariable Long proposalId
    ) {
        List<ProposalCoordinationExpectationRS> history =
                coordinationService.getAllForProposal(proposalId);

        return new ResponseEntity<>(history, HttpStatus.OK);
    }

    /**
     * Get all active/latest coordination expectations for a proposal
     */
    @GetMapping("/active")
    public ResponseEntity<List<ProposalCoordinationExpectationRS>> getActiveExpectations(
            @PathVariable Long proposalId
    ) {
        List<ProposalCoordinationExpectationRS> active =
                coordinationService.getExpectations(proposalId);

        return new ResponseEntity<>(active, HttpStatus.OK);
    }
}
