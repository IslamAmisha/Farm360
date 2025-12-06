package com.Farm360.dto.response.dashboard;

import lombok.Data;

import java.util.List;

@Data
public class DashboardListRS {
    private List<DashboardCardRS> users;
}
