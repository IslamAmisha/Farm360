package com.Farm360.dto.request.sendreq;

import com.Farm360.utils.SeasonType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendRequestRQ {
    private Long receiverId;
    private Long cropId;
    private Long subCategoryId;
    private Long landId;
    private SeasonType season;
}
