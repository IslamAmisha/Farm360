package com.Farm360.service.agreement;

import com.Farm360.dto.request.agreement.AgreementCreateRQ;
import com.Farm360.dto.response.agreement.AgreementListRS;
import com.Farm360.dto.response.agreement.AgreementRS;

import java.util.List;

public interface AgreementService {

    AgreementRS createAgreement(AgreementCreateRQ rq);

    AgreementRS getAgreement(Long agreementId, Long userId);

    List<AgreementListRS> getMyAgreements(Long userId);
}
