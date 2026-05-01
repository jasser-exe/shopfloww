package com.shopflow.controller;

import com.shopflow.dto.request.PlaceOrderRequest;
import jakarta.validation.Valid;
import com.shopflow.dto.response.OrderResponse;
import com.shopflow.entity.OrderStatus;
import com.shopflow.entity.Role;
import com.shopflow.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderController {

    private final OrderService orderService;

    private Long getCurrentUserId(@SuppressWarnings("unused") Authentication auth) {
        // TODO: extract user ID from JWT token in auth
        return 1L; // placeholder
    }

    private Role getCurrentUserRole(@SuppressWarnings("unused") Authentication auth) {
        // TODO: extract role from JWT token in auth
        return Role.CUSTOMER; // placeholder
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Place order", description = "Place a new order from the shopping cart")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Order placed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid order data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<OrderResponse> placeOrder(Authentication auth, @RequestBody PlaceOrderRequest request) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(customerId, request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get my orders", description = "Retrieve paginated list of customer's orders")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Page<OrderResponse>> getMyOrders(Authentication auth, Pageable pageable) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.ok(orderService.getMyOrders(customerId, pageable));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all orders", description = "Retrieve all orders (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Orders retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Page<OrderResponse>> getAllOrders(Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieve a specific order by ID (with access control)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> getOrderById(Authentication auth, @PathVariable Long id) {
        Long requesterId = getCurrentUserId(auth);
        Role role = getCurrentUserRole(auth);
        return ResponseEntity.ok(orderService.getOrderById(id, requesterId, role));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @Operation(summary = "Update order status", description = "Update the status of an order (Seller/Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid status"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> updateStatus(Authentication auth, @PathVariable Long id, @RequestBody UpdateOrderStatusRequest request) {
        Long requesterId = getCurrentUserId(auth);
        Role role = getCurrentUserRole(auth);
        return ResponseEntity.ok(orderService.updateStatus(id, request.getStatus(), requesterId, role));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Cancel order", description = "Cancel an order (Customer only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order cancelled successfully"),
            @ApiResponse(responseCode = "400", description = "Cannot cancel order"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public ResponseEntity<OrderResponse> cancelOrder(Authentication auth, @PathVariable Long id) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.ok(orderService.cancelOrder(id, customerId));
    }

    // Inner DTO
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UpdateOrderStatusRequest {
        private OrderStatus status;
    }
}
