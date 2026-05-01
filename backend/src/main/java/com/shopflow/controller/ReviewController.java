package com.shopflow.controller;

import com.shopflow.dto.request.CreateReviewRequest;
import com.shopflow.dto.response.ReviewResponse;
import com.shopflow.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product review management endpoints")
public class ReviewController {

    private final ReviewService reviewService;

    private Long getCurrentUserId(@SuppressWarnings("unused") Authentication auth) {
        // TODO: extract user ID from JWT token in auth
        return 1L; // placeholder
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Post review", description = "Post a review for a product (Customer only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Review posted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid review data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ReviewResponse> postReview(Authentication auth, @Valid @RequestBody CreateReviewRequest request) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.postReview(customerId, request));
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get product reviews", description = "Retrieve paginated reviews for a product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reviews retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<Page<ReviewResponse>> getProductReviews(@PathVariable Long productId, Pageable pageable) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId, pageable));
    }

    @PutMapping("/{reviewId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve review", description = "Approve a pending review (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review approved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<ReviewResponse> approveReview(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.approveReview(reviewId));
    }
}
