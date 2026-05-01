package com.shopflow.service;

import com.shopflow.dto.response.AdminDashboardResponse;
import com.shopflow.dto.response.CustomerDashboardResponse;
import com.shopflow.dto.response.SellerDashboardResponse;

public interface DashboardService {
    AdminDashboardResponse getAdminDashboard();
    SellerDashboardResponse getSellerDashboard(Long sellerId);
    CustomerDashboardResponse getCustomerDashboard(Long customerId);
}

