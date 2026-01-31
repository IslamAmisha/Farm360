package com.Farm360.service.module.input;


import com.Farm360.dto.request.module.input.*;
import com.Farm360.dto.response.module.input.*;

import java.util.List;

public interface InputSupplyService {


    InputSupplyOrderRS createOrder(
            Long agreementId,
            InputSupplyOrderCreateRQ rq,
            Long buyerUserId
    );

    InputSupplyProofRS uploadProof(
            Long orderId,
            InputSupplyProofUploadRQ rq,
            Long farmerUserId
    );

    InputSupplyApprovalRS approveOrReject(
            Long orderId,
            InputSupplyApprovalRQ rq,
            Long buyerUserId
    );


    InputSupplyOrderRS getOrder(Long orderId, Long userId);
    List<InputSupplyOrderRS> getOrdersByAgreement(Long agreementId);
}

