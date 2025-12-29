package com.Farm360.controller.proposal;



import com.Farm360.dto.request.proposal.ProposalCreateRQ;
import com.Farm360.dto.response.proposal.ProposalRS;
import com.Farm360.service.proposal.ProposalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;

    /* -------------------- CREATE / UPDATE DRAFT -------------------- */
    @PostMapping("/draft")
    public ResponseEntity<ProposalRS> createOrUpdateDraft(
            @RequestParam Long senderUserId,
            @RequestBody ProposalCreateRQ rq
    ) {
        ProposalRS rs = proposalService.createDraftProposal(senderUserId, rq);
        return ResponseEntity.ok(rs);
    }

    /* -------------------- SEND PROPOSAL -------------------- */
    @PostMapping("/{proposalId}/send")
    public ResponseEntity<Void> sendProposal(
            @RequestParam Long senderUserId,
            @PathVariable Long proposalId
    ) {
        proposalService.sendProposal(senderUserId, proposalId);
        return ResponseEntity.ok().build();
    }

    /* -------------------- ACCEPT PROPOSAL -------------------- */
    @PostMapping("/{proposalId}/accept")
    public ResponseEntity<Void> acceptProposal(
            @RequestParam Long receiverUserId,
            @PathVariable Long proposalId
    ) {
        proposalService.acceptProposal(receiverUserId, proposalId);
        return ResponseEntity.ok().build();
    }

    /* -------------------- REJECT PROPOSAL -------------------- */
    @PostMapping("/{proposalId}/reject")
    public ResponseEntity<Void> rejectProposal(
            @RequestParam Long receiverUserId,
            @PathVariable Long proposalId
    ) {
        proposalService.rejectProposal(receiverUserId, proposalId);
        return ResponseEntity.ok().build();
    }

    /* -------------------- CANCEL PROPOSAL -------------------- */
    @PostMapping("/{proposalId}/cancel")
    public ResponseEntity<Void> cancelProposal(
            @RequestParam Long senderUserId,
            @PathVariable Long proposalId
    ) {
        proposalService.cancelProposal(senderUserId, proposalId);
        return ResponseEntity.ok().build();
    }

    /* -------------------- GET PROPOSAL BY ID -------------------- */
    @GetMapping("/{proposalId}")
    public ResponseEntity<ProposalRS> getProposalById(
            @RequestParam Long userId,
            @PathVariable Long proposalId
    ) {
        ProposalRS rs = proposalService.getProposalById(userId, proposalId);
        return ResponseEntity.ok(rs);
    }

    /* -------------------- GET PROPOSALS BY REQUEST -------------------- */
    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<ProposalRS>> getProposalsByRequest(
            @RequestParam Long userId,
            @PathVariable Long requestId
    ) {
        List<ProposalRS> rsList = proposalService.getProposalsByRequest(userId, requestId);
        return ResponseEntity.ok(rsList);
    }

    /* -------------------- GET INCOMING PROPOSALS -------------------- */
    @GetMapping("/incoming")
    public ResponseEntity<List<ProposalRS>> getIncomingProposals(
            @RequestParam Long receiverUserId
    ) {
        List<ProposalRS> rsList = proposalService.getIncomingProposals(receiverUserId);
        return ResponseEntity.ok(rsList);
    }

    /* -------------------- GET OUTGOING PROPOSALS -------------------- */
    @GetMapping("/outgoing")
    public ResponseEntity<List<ProposalRS>> getOutgoingProposals(
            @RequestParam Long senderUserId
    ) {
        List<ProposalRS> rsList = proposalService.getOutgoingProposals(senderUserId);
        return ResponseEntity.ok(rsList);
    }
}
