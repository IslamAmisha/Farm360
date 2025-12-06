package com.Farm360.dto.request.land;

import lombok.Data;

import java.util.List;

@Data
public class LandUpdateRQ {

    private Double size;
    private List<Long> subCategoryIds;
}

