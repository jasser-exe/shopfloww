package com.shopflow.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long customerId;
    private String customerName;
    private Integer rating;
    private String comment;
    private boolean approved;
    private LocalDateTime createdAt;
}

