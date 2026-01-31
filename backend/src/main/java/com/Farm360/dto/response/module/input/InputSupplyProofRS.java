package com.Farm360.dto.response.module.input;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InputSupplyProofRS {

    private Long id;

    private String imageUrl;

    private Double geoLat;
    private Double geoLng;

    private String remarks;

    private Integer attemptNo;

    private LocalDateTime uploadedAt;
}

