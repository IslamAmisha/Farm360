package com.Farm360.mapper.proposal;


import com.Farm360.dto.request.proposal.ProposalCoordinationExpectationRQ;
import com.Farm360.dto.response.proposal.ProposalCoordinationExpectationRS;
import com.Farm360.model.proposal.ProposalCoordinationExpectationEntity;
import com.Farm360.model.proposal.ProposalEntity;
import lombok.experimental.UtilityClass;

import java.time.Duration;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@UtilityClass
public class ProposalCoordinationExpectationMapper {

    /**
     * Map Request DTO → Entity
     *
     * @param rq request DTO from controller
     * @param proposal parent proposal entity
     * @return entity ready to persist
     */
    public ProposalCoordinationExpectationEntity toEntity(
            ProposalCoordinationExpectationRQ rq,
            ProposalEntity proposal
    ) {
        if (rq == null || proposal == null) return null;

        return ProposalCoordinationExpectationEntity.builder()
                .proposal(proposal)
                .proposalVersion(proposal.getProposalVersion())
                .subject(rq.getSubject())
                .coordinationType(rq.getCoordinationType())
                .actionRequiredBy(rq.getActionRequiredBy())
                .expectedWithin(rq.getExpectedWithin())
                .note(rq.getNote())
                .active(true) // latest snapshot is active
                .build();
    }

    /**
     * Map Entity → Response DTO
     *
     * @param entity coordination entity
     * @param proposalCreationDate for calculating expectedBy if needed
     * @return response DTO
     */
    public ProposalCoordinationExpectationRS toRS(
            ProposalCoordinationExpectationEntity entity,
            LocalDate proposalCreationDate
    ) {
        if (entity == null) return null;

        LocalDate expectedBy = null;
        if (entity.getExpectedWithin() != null && proposalCreationDate != null) {
            // calculate expectedBy = creationDate + duration
            expectedBy = proposalCreationDate.plus(
                    entity.getExpectedWithin().toDays(), ChronoUnit.DAYS
            );
        }

        return ProposalCoordinationExpectationRS.builder()
                .id(entity.getId())
                .subject(entity.getSubject())
                .actionRequiredBy(entity.getActionRequiredBy())
                .expectedBy(expectedBy)
                .note(entity.getNote())
                .proposalVersion(entity.getProposalVersion())
                .build();

    }
}
