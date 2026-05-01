package com.shopflow.service;

import com.shopflow.dto.request.CreateCouponRequest;
import com.shopflow.dto.response.CouponResponse;
import com.shopflow.dto.response.CouponValidationResponse;

public interface CouponService {
    CouponResponse createCoupon(CreateCouponRequest request);
    CouponResponse updateCoupon(Long id, CreateCouponRequest request);
    void deleteCoupon(Long id);
    CouponValidationResponse validateCoupon(String code);
}

