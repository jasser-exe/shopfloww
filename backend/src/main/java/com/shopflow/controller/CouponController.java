package com.shopflow.controller;

import com.shopflow.dto.request.CreateCouponRequest;
import com.shopflow.dto.response.CouponResponse;
import com.shopflow.dto.response.CouponValidationResponse;
import com.shopflow.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Coupons", description = "Coupon management endpoints")
public class CouponController {

    private final CouponService couponService;

    @PostMapping
    @Operation(summary = "Create coupon", description = "Create a new coupon (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Coupon created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<CouponResponse> createCoupon(@Valid @RequestBody CreateCouponRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(couponService.createCoupon(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update coupon", description = "Update an existing coupon (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coupon updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public ResponseEntity<CouponResponse> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CreateCouponRequest request) {
        return ResponseEntity.ok(couponService.updateCoupon(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete coupon", description = "Delete a coupon (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Coupon deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/validate/{code}")
    @PreAuthorize("permitAll()")
    @Operation(summary = "Validate coupon", description = "Validate a coupon code (Public access)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coupon validation result"),
            @ApiResponse(responseCode = "404", description = "Coupon not found")
    })
    public ResponseEntity<CouponValidationResponse> validateCoupon(@PathVariable String code) {
        return ResponseEntity.ok(couponService.validateCoupon(code));
    }
}
