package com.shopflow.service;

import com.shopflow.dto.request.PlaceOrderRequest;
import com.shopflow.dto.response.OrderResponse;
import com.shopflow.entity.OrderStatus;
import com.shopflow.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse placeOrder(Long customerId, PlaceOrderRequest request);
    OrderResponse getOrderById(Long id, Long requesterId, Role role);
    Page<OrderResponse> getMyOrders(Long customerId, Pageable pageable);
    Page<OrderResponse> getAllOrders(Pageable pageable);
    OrderResponse updateStatus(Long orderId, OrderStatus newStatus, Long requesterId, Role role);
    OrderResponse cancelOrder(Long orderId, Long customerId);
}

