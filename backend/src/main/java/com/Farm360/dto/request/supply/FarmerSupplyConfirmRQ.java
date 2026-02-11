package com.Farm360.dto.request.supply;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FarmerSupplyConfirmRQ {

    private Long orderId;

    private Boolean accepted;
    private String farmerRemark;

    private LocalDate actualDeliveryDate;
}