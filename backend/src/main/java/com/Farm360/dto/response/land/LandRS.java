package com.Farm360.dto.response.land;

import com.Farm360.utils.CroppingPattern;
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
    private CroppingPattern croppingPattern;

    private List<CropRS> crops;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CropRS {
        private Long id;
        private String name;
        private List<SubCategoryRS> subcategories;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SubCategoryRS {
        private Long id;
        private String name;
    }
}
