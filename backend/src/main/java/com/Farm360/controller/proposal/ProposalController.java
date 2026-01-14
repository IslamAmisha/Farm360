package com.Farm360.controller.proposal;

import com.Farm360.dto.request.proposal.ProposalCreateRQ;
import com.Farm360.dto.response.proposal.ProposalRS;
import com.Farm360.service.proposal.ProposalService;
import com.Farm360.utils.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proposals")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    @PostMapping("/draft")
    public ResponseEntity<ProposalRS> createOrUpdateDraft(
            @RequestParam Long senderUserId,
            @RequestParam Role currentUserRole,
            @RequestBody ProposalCreateRQ rq
    ) {
        return ResponseEntity.ok(
                proposalService.createDraftProposal(senderUserId, rq, currentUserRole)
        );
    }

    @PostMapping("/{proposalId}/send")
    public ResponseEntity<Void> sendProposal(
            @PathVariable Long proposalId,
            @RequestParam Long senderUserId,
            @RequestParam Role currentUserRole
    ) {
        proposalService.sendProposal(senderUserId, proposalId, currentUserRole);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{proposalId}/accept")
    public ResponseEntity<Void> acceptProposal(
            @PathVariable Long proposalId,
            @RequestParam Long receiverUserId
    ) {
        proposalService.acceptProposal(receiverUserId, proposalId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{proposalId}/reject")
    public ResponseEntity<Void> rejectProposal(
            @PathVariable Long proposalId,
            @RequestParam Long receiverUserId
    ) {
        proposalService.rejectProposal(receiverUserId, proposalId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{proposalId}/cancel")
    public ResponseEntity<Void> cancelProposal(
            @PathVariable Long proposalId,
            @RequestParam Long senderUserId
    ) {
        proposalService.cancelProposal(senderUserId, proposalId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{proposalId}/counter")
    public ResponseEntity<ProposalRS> counterProposal(
            @PathVariable Long proposalId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                proposalService.createCounterProposal(userId, proposalId)
        );
    }

    @GetMapping("/{proposalId}")
    public ResponseEntity<ProposalRS> getProposalById(
            @PathVariable Long proposalId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                proposalService.getProposalById(userId, proposalId)
        );
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<ProposalRS>> getProposalsByRequest(
            @PathVariable Long requestId,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(
                proposalService.getProposalsByRequest(userId, requestId)
        );
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<ProposalRS>> getIncomingProposals(
            @RequestParam Long receiverUserId
    ) {
        return ResponseEntity.ok(
                proposalService.getIncomingProposals(receiverUserId)
        );
    }
    
    @GetMapping("/outgoing")
    public ResponseEntity<List<ProposalRS>> getOutgoingProposals(
            @RequestParam Long senderUserId
    ) {
        return ResponseEntity.ok(
                proposalService.getOutgoingProposals(senderUserId)
        );
    }

    @PostMapping("/save-and-send")
    public ResponseEntity<String> saveAndSend(
            @RequestParam Long senderUserId,
            @RequestParam Role currentUserRole,
            @RequestBody ProposalCreateRQ rq
    ) {
        proposalService.saveAndSendProposal(
                senderUserId, rq, currentUserRole
        );
        return ResponseEntity.ok("Proposal sent successfully");
    }

}
