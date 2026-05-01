package com.shopflow.repository;

import com.shopflow.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByProductIdAndApprovedTrue(Long productId, Pageable pageable);

    boolean existsByCustomerIdAndProductId(Long customerId, Long productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.approved = true")
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    @Query("SELECT CASE WHEN COUNT(oi) > 0 THEN true ELSE false END FROM OrderItem oi JOIN oi.order o WHERE o.customer.id = :customerId AND o.status = 'DELIVERED' AND oi.product.id = :productId")
    boolean customerHasPurchased(@Param("customerId") Long customerId, @Param("productId") Long productId);

    List<Review> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

}


