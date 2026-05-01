package com.shopflow.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerDashboardResponse {
    private BigDecimal myRevenue;
    private Long pendingOrdersCount;
    private List<ProductSummary> lowStockProducts;
    private List<OrderResponse> recentOrders;
}

