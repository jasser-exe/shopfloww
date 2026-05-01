package com.shopflow.service.impl;

import com.shopflow.dto.response.*;
import com.shopflow.entity.Order;
import com.shopflow.entity.OrderStatus;
import com.shopflow.entity.Product;
import com.shopflow.entity.Review;
import com.shopflow.repository.*;
import com.shopflow.service.DashboardService;
import lombok.RequiredArgsConstructor;
import com.shopflow.repository.SellerProfileRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final SellerProfileRepository sellerProfileRepository;

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        BigDecimal totalRevenue = orderRepository.getTotalRevenue() != null ? orderRepository.getTotalRevenue() : BigDecimal.ZERO;
        Long totalOrders = orderRepository.getDeliveredOrdersCount() != null ? orderRepository.getDeliveredOrdersCount() : 0L;
        Long totalUsers = userRepository.count();

        List<Product> topProducts = productRepository.findTop10ByOrderBySoldCountDesc();
        List<ProductSummary> topProductsList = topProducts.stream()
                .limit(5)
                .map(p -> ProductSummary.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .soldCount(p.getSoldCount())
                        .price(p.getPrice())
                        .stock(p.getStock())
                        .build())
                    .toList();

        List<Order> recentOrdersList = orderRepository.getRecentOrders();
        List<OrderResponse> recentOrders = recentOrdersList.stream()
                .map(o -> OrderResponse.builder()
                        .id(o.getId())
                        .orderNumber(o.getOrderNumber())
                        .customerId(o.getCustomer().getId())
                        .status(o.getStatus())
                        .totalTTC(o.getTotalTTC())
                        .orderedAt(o.getOrderedAt())
                        .build())
                .collect(Collectors.toList());

        List<SellerSummary> topSellers = java.util.Collections.emptyList();

        return AdminDashboardResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalUsers(totalUsers)
                .topProducts(topProductsList)
                .topSellers(topSellers)
                .recentOrders(recentOrders)
                .build();
    }

    @Override
    public SellerDashboardResponse getSellerDashboard(Long sellerId) {
        // Get seller's products
        var sellerProducts = productRepository.findAll().stream()
                .filter(p -> p.getSeller() != null && p.getSeller().getUser().getId().equals(sellerId))
                .collect(Collectors.toList());

        // My revenue - sum of delivered orders containing this seller's products
        BigDecimal myRevenue = BigDecimal.ZERO;
        for (Order order : orderRepository.findByStatusIn(java.util.List.of(OrderStatus.DELIVERED))) {
            for (var item : order.getItems()) {
                for (Product p : sellerProducts) {
                    if (item.getProduct().equals(p)) {
                        myRevenue = myRevenue.add(item.getUnitPrice().multiply(java.math.BigDecimal.valueOf(item.getQuantity())));
                    }
                }
            }
        }

        // Pending orders count for this seller
        Long pendingOrdersCount = orderRepository.countByStatus(OrderStatus.PENDING);

        // Low stock products
        List<ProductSummary> lowStockProducts = sellerProducts.stream()
                .filter(p -> p.getStock() < 5)
                .map(p -> ProductSummary.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .stock(p.getStock())
                        .price(p.getPrice())
                        .build())
                .collect(Collectors.toList());

        // Recent orders (simplified - last 10 orders)
        List<Order> recentOrdersList = orderRepository.getRecentOrders();
        List<OrderResponse> recentOrders = recentOrdersList.stream()
                .limit(10)
                .map(o -> OrderResponse.builder()
                        .id(o.getId())
                        .orderNumber(o.getOrderNumber())
                        .customerId(o.getCustomer().getId())
                        .status(o.getStatus())
                        .totalTTC(o.getTotalTTC())
                        .orderedAt(o.getOrderedAt())
                        .build())
                .collect(Collectors.toList());

        return SellerDashboardResponse.builder()
                .myRevenue(myRevenue)
                .pendingOrdersCount(pendingOrdersCount)
                .lowStockProducts(lowStockProducts)
                .recentOrders(recentOrders)
                .build();
    }

    @Override
    public CustomerDashboardResponse getCustomerDashboard(Long customerId) {
        // Active orders (not DELIVERED or CANCELLED)
        List<Order> activeOrders = orderRepository.findByStatusIn(List.of(OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED));
        List<OrderResponse> activeOrdersList = activeOrders.stream()
                .filter(o -> o.getCustomer().getId().equals(customerId))
                .map(o -> OrderResponse.builder()
                        .id(o.getId())
                        .orderNumber(o.getOrderNumber())
                        .customerId(o.getCustomer().getId())
                        .status(o.getStatus())
                        .totalTTC(o.getTotalTTC())
                        .orderedAt(o.getOrderedAt())
                        .build())
                .collect(Collectors.toList());

        // Recent reviews
        List<Review> recentReviews = reviewRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        List<ReviewResponse> recentReviewsList = recentReviews.stream()
                .limit(5)
                .map(r -> ReviewResponse.builder()
                        .id(r.getId())
                        .productId(r.getProduct().getId())
                        .productName(r.getProduct().getName())
                        .customerId(r.getCustomer().getId())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .approved(r.isApproved())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return CustomerDashboardResponse.builder()
                .activeOrders(activeOrdersList)
                .recentReviews(recentReviewsList)
                .build();
    }
}



