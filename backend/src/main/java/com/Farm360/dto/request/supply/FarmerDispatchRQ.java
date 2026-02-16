package com.Farm360.dto.request.supply;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FarmerDispatchRQ {

    private Long orderId;

    private String vehicleNumber;
    private String loadingPhotoUrl;
    private Integer bagCount; // optional
}