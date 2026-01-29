package com.Farm360.mapper.proposal;

import com.Farm360.dto.response.proposal.ProposalCoordinationExpectationRS;
import com.Farm360.model.proposal.ProposalCoordinationExpectationEntity;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ProposalCoordinationExpectationMapper {

    public ProposalCoordinationExpectationRS toRS(
            ProposalCoordinationExpectationEntity entity
    ) {
        if (entity == null) return null;

        return ProposalCoordinationExpectationRS.builder()
                .id(entity.getId())
                .subject(entity.getSubject())
                .coordinationType(entity.getCoordinationType())
                .actionRequiredBy(entity.getActionRequiredBy())
                .expectedBy(null) // proposal layer never calculates dates
                .note(entity.getNote())
                .proposalVersion(entity.getProposalVersion())
                .build();
    }
}
