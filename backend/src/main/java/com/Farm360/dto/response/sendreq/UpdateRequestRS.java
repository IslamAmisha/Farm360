package com.Farm360.dto.response.sendreq;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateRequestRS {
    private String message;
    private boolean success;
}

