package com.shopflow.service.impl;

import com.shopflow.dto.request.CreateReviewRequest;
import com.shopflow.dto.response.ReviewResponse;
import com.shopflow.entity.Product;
import com.shopflow.entity.Review;
import com.shopflow.entity.User;
import com.shopflow.repository.ProductRepository;
import com.shopflow.repository.ReviewRepository;
import com.shopflow.repository.UserRepository;
import com.shopflow.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewResponse postReview(Long customerId, CreateReviewRequest request) {
        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!reviewRepository.customerHasPurchased(customerId, request.getProductId())) {
            throw new IllegalArgumentException("Customer has not purchased this product");
        }

        if (reviewRepository.existsByCustomerIdAndProductId(customerId, request.getProductId())) {
            throw new IllegalArgumentException("Review already exists for this product");
        }

        User customer = userRepository.findById(customerId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Review review = Review.builder()
                .customer(customer)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .approved(false)
                .build();

        review = reviewRepository.save(review);
        return mapToResponse(review);
    }

    @Override
    public Page<ReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        return reviewRepository.findByProductIdAndApprovedTrue(productId, pageable).map(this::mapToResponse);
    }

    @Override
    public ReviewResponse approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setApproved(true);
        review = reviewRepository.save(review);
        return mapToResponse(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getFirstName() + " " + review.getCustomer().getLastName())
                .rating(review.getRating())
                .comment(review.getComment())
                .approved(review.isApproved())
                .createdAt(review.getCreatedAt())
                .build();
    }
}

