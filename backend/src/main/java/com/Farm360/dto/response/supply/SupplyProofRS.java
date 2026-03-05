package com.Farm360.dto.response.supply;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplyProofRS {

    private String type;
    private String fileUrl;
    private String metadata;  // vehicle number, bag count, etc.
}