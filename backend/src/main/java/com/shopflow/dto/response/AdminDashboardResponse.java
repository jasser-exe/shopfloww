package com.shopflow.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalUsers;
    private List<ProductSummary> topProducts;
    private List<SellerSummary> topSellers;
    private List<OrderResponse> recentOrders;
}

