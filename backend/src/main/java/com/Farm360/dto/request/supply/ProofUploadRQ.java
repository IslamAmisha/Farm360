package com.Farm360.dto.request.supply;

import com.Farm360.utils.ProofType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProofUploadRQ {

    private ProofType type;

    private String fileUrl;

    private String metadata;
    // vehicle number / warehouse name / machine number etc
}