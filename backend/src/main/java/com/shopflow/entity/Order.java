package com.shopflow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders", uniqueConstraints = {@UniqueConstraint(columnNames = "order_number")})
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Order extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;

    @Column(length = 2000)
    private String deliveryAddress;

    @Column(nullable = false)
    private BigDecimal subTotal;

    @Column(nullable = false)
    private BigDecimal shippingFee;

    @Column(nullable = false)
    private BigDecimal totalTTC;

    @CreationTimestamp
    private LocalDateTime orderedAt;

    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    private void prePersist() {
        if (this.orderNumber == null || this.orderNumber.isBlank()) {
            int year = LocalDateTime.now().getYear();
            String rand = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 5).toUpperCase();
            this.orderNumber = String.format("ORD-%d-%s", year, rand);
        }
    }

}
