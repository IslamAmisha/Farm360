package com.Farm360.service.request;

import com.Farm360.dto.request.sendreq.SendRequestRQ;
import com.Farm360.dto.request.sendreq.UpdateRequestRQ;
import com.Farm360.dto.response.sendreq.RequestListRS;
import com.Farm360.dto.response.sendreq.SendRequestRS;
import com.Farm360.dto.response.sendreq.UpdateRequestRS;

public interface RequestService {
    SendRequestRS sendRequest(Long senderUserId, SendRequestRQ rq);

    UpdateRequestRS updateRequest(UpdateRequestRQ rq);

    RequestListRS getIncomingRequests(Long userId);

    RequestListRS getOutgoingRequests(Long userId);
}
