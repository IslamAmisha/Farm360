package com.Farm360.dto.request.Farmer;

import com.Farm360.utils.CroppingPattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FarmerRegisterRQ {

    private String farmerName;
    private Long districtId;
    private Long blockId;
    private String village;
    private String pinCode;
    private Double landSize;

    private CroppingPattern croppingPattern;

    private List<Long> cropIds;
    private List<Long> subCategoryIds;

    private MultipartFile landPhoto;
}
