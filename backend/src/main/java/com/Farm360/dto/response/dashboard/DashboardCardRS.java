package com.Farm360.dto.response.dashboard;

import lombok.Data;

import java.util.List;

@Data
public class DashboardCardRS {

    private Long userId;       // buyerId or farmerId
    private String name;
    private String district;
    private String villageOrCity;
    private String businessName;   // only for buyers

    private int ratingUp;
    private int ratingDown;

    private List<String> crops;

    private boolean canSendRequest;
    private String requestStatus; // NONE / PENDING / ACCEPTED
}

