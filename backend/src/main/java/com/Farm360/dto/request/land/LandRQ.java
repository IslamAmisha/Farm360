package com.Farm360.dto.request.land;

import com.Farm360.utils.CroppingPattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LandRQ {
    private Double size;
    private CroppingPattern croppingPattern;
    private List<Long> subCategoryIds;
}
