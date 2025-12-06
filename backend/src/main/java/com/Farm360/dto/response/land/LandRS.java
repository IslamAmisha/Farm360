package com.Farm360.dto.response.land;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LandRS {
    private Long landId;
    private Double size;
    private List<String> crops;
}
