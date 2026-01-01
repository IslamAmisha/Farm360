package com.Farm360.service.proposal;

import com.Farm360.dto.request.proposal.ProposalCreateRQ;
import com.Farm360.dto.response.proposal.ProposalRS;
import com.Farm360.utils.Role;

import java.util.List;

public interface ProposalService {

    ProposalRS createDraftProposal(Long senderUserId, ProposalCreateRQ rq, Role currentUserRole);

    void sendProposal(Long senderUserId, Long proposalId, Role currentUserRole);

    void acceptProposal(Long receiverUserId, Long proposalId);

    void rejectProposal(Long receiverUserId, Long proposalId);

    void cancelProposal(Long senderUserId, Long proposalId);

    ProposalRS getProposalById(Long userId, Long proposalId);

    List<ProposalRS> getProposalsByRequest(Long userId, Long requestId);

    List<ProposalRS> getIncomingProposals(Long receiverUserId);

    List<ProposalRS> getOutgoingProposals(Long senderUserId);

    ProposalRS createCounterProposal(Long userId, Long proposalId);
}
