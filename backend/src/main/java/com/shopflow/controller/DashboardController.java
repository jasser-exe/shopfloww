package com.shopflow.controller;

import com.shopflow.dto.response.AdminDashboardResponse;
import com.shopflow.dto.response.CustomerDashboardResponse;
import com.shopflow.dto.response.SellerDashboardResponse;
import com.shopflow.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard data endpoints for different user roles")
public class DashboardController {

    private final DashboardService dashboardService;

    private Long getCurrentUserId(@SuppressWarnings("unused") Authentication auth) {
        // TODO: extract user ID from JWT token in auth
        return 1L; // placeholder
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard", description = "Retrieve dashboard data for admin users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<AdminDashboardResponse> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "Get seller dashboard", description = "Retrieve dashboard data for seller users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<SellerDashboardResponse> getSellerDashboard(Authentication auth) {
        Long sellerId = getCurrentUserId(auth);
        return ResponseEntity.ok(dashboardService.getSellerDashboard(sellerId));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get customer dashboard", description = "Retrieve dashboard data for customer users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<CustomerDashboardResponse> getCustomerDashboard(Authentication auth) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.ok(dashboardService.getCustomerDashboard(customerId));
    }
}
