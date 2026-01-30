package com.Farm360.dto.request.agreement;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgreementCreateRQ {


    private Long proposalId;

    private Long userId;
}
