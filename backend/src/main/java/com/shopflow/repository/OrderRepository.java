package com.shopflow.repository;

import com.shopflow.entity.Order;
import com.shopflow.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByCustomerIdOrderByOrderedAtDesc(Long customerId, Pageable pageable);
    List<Order> findByStatusIn(List<OrderStatus> statuses);

    @Query("SELECT SUM(o.totalTTC) FROM Order o WHERE o.status = 'DELIVERED'")
    java.math.BigDecimal getTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'DELIVERED'")
    Long getDeliveredOrdersCount();

    @Query("SELECT o FROM Order o ORDER BY o.orderedAt DESC LIMIT 10")
    List<Order> getRecentOrders();

    @Query("SELECT o FROM Order o WHERE o.customer NOT IN (SELECT DISTINCT p.seller.user FROM Product p)")
    List<Order> getCustomerRecentOrders();

    @Query("SELECT o FROM Order o WHERE o.status != 'DELIVERED' AND o.status != 'CANCELLED' ORDER BY o.orderedAt DESC")
    List<Order> getActiveOrders(Long customerId);

    Long countByStatus(OrderStatus status);
}





