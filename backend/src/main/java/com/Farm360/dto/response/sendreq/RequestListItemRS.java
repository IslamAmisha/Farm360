package com.Farm360.dto.response.sendreq;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestListItemRS {

    private Long requestId;

    private Long senderId;
    private String senderName;
    private String senderRole;

    private Long receiverId;
    private String receiverName;
    private String receiverRole;

    private Long cropId;
    private String cropName;

    private Long subCategoryId;
    private String subCategoryName;

    private Long landId;
    private Double landSize;

    private String season;

    private String status; // PENDING / ACCEPTED / REJECTED
    private String createdAt;

    private String companyName;
    private String district;
    private String city;
    private int thumbsUp;
    private int thumbsDown;

}
