package com.shopflow.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerSummary {
    private Long userId;
    private String sellerName;
    private BigDecimal totalRevenue;
    private Long totalSold;
}

