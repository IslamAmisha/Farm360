package com.Farm360.controller.proposal;

import com.Farm360.dto.response.proposal.ProposalHistoryRS;
import com.Farm360.dto.response.proposal.ProposalListRS;
import com.Farm360.service.proposal.ProposalDashboardService;
import com.Farm360.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proposals")
public class ProposalDashboardController {

    @Autowired
    private ProposalDashboardService dashboardService;


    @GetMapping("/my")
    public List<ProposalListRS> myProposals(
            @RequestParam Long userId,
            @RequestParam Role role
    ) {
        return dashboardService.getMyProposals(userId, role);
    }

    @GetMapping("/{requestId}/history")
    public ProposalHistoryRS proposalHistory(
            @PathVariable Long requestId,
            @RequestParam Long userId
    ) {
        return dashboardService.getProposalHistory(requestId, userId);
    }
}
