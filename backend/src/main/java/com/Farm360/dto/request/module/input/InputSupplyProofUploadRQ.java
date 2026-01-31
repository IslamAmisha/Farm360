package com.Farm360.dto.request.module.input;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyProofUploadRQ {

    private Long orderId;

    private String imageUrl;

    private Double geoLat;
    private Double geoLng;

    private String remarks; // farmer explanation / brand mismatch note
}
