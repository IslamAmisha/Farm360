package com.Farm360.dto.response.sendreq;

import lombok.Data;
import java.util.List;

@Data
public class RequestListRS {
    private List<RequestListItemRS> requests;
}