package com.shopflow.dto.response;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDashboardResponse {
    private List<OrderResponse> activeOrders;
    private List<ReviewResponse> recentReviews;
}

