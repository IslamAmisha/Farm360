package com.Farm360.dto.request.proposal;
import com.Farm360.utils.CoordinationSubject;
import com.Farm360.utils.CoordinationType;
import com.Farm360.utils.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Duration;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProposalCoordinationExpectationRQ {

    /**
     * What coordination is being negotiated
     */
    private CoordinationSubject subject;
    private CoordinationType coordinationType;

    /**
     * Who must act (FARMER / BUYER)
     */
    private Role actionRequiredBy;

    /**
     * Negotiated time window / deadline
     */
    private Duration expectedWithin;

    /**
     * Optional negotiation note
     */
    private String note;
}
