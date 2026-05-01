package com.shopflow.service.impl;

import com.shopflow.dto.request.CreateCouponRequest;
import com.shopflow.dto.response.CouponResponse;
import com.shopflow.dto.response.CouponValidationResponse;
import com.shopflow.entity.Coupon;
import com.shopflow.repository.CouponRepository;
import com.shopflow.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    public CouponResponse createCoupon(CreateCouponRequest request) {
        if (couponRepository.findByCodeAndActiveTrue(request.getCode()).isPresent()) {
            throw new IllegalArgumentException("Coupon code already exists");
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode())
                .type(request.getType())
                .value(request.getValue())
                .expiresAt(request.getExpiresAt())
                .maxUsages(request.getMaxUsages())
                .currentUsages(0)
                .active(request.isActive())
                .build();

        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon);
    }

    @Override
    public CouponResponse updateCoupon(Long id, CreateCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));

        coupon.setCode(request.getCode());
        coupon.setType(request.getType());
        coupon.setValue(request.getValue());
        coupon.setExpiresAt(request.getExpiresAt());
        coupon.setMaxUsages(request.getMaxUsages());
        coupon.setActive(request.isActive());

        coupon = couponRepository.save(coupon);
        return mapToResponse(coupon);
    }

    @Override
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        couponRepository.delete(coupon);
    }

    @Override
    public CouponValidationResponse validateCoupon(String code) {
        var maybe = couponRepository.findByCodeAndActiveTrue(code);

        if (maybe.isEmpty()) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Coupon not found or inactive")
                    .build();
        }

        Coupon coupon = maybe.get();

        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now())) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Coupon expired")
                    .build();
        }

        if (coupon.getMaxUsages() != null && coupon.getCurrentUsages() != null && coupon.getCurrentUsages() >= coupon.getMaxUsages()) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Coupon usage limit reached")
                    .build();
        }

        return CouponValidationResponse.builder()
                .valid(true)
                .code(code)
                .type(coupon.getType().toString())
                .value(coupon.getValue())
                .message("Coupon is valid")
                .build();
    }

    private CouponResponse mapToResponse(Coupon coupon) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .type(coupon.getType())
                .value(coupon.getValue())
                .expiresAt(coupon.getExpiresAt())
                .maxUsages(coupon.getMaxUsages())
                .currentUsages(coupon.getCurrentUsages())
                .active(coupon.isActive())
                .build();
    }
}

