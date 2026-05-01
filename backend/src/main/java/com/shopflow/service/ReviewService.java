package com.shopflow.service;

import com.shopflow.dto.request.CreateReviewRequest;
import com.shopflow.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewResponse postReview(Long customerId, CreateReviewRequest request);
    Page<ReviewResponse> getProductReviews(Long productId, Pageable pageable);
    ReviewResponse approveReview(Long reviewId);
}

