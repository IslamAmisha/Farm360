package com.Farm360.dto.request.sendreq;

import lombok.Data;

@Data
public class UpdateRequestRQ {
    private Long requestId;
    private String action; // ACCEPT or REJECT
}
