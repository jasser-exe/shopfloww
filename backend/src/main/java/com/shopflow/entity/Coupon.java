package com.shopflow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons", uniqueConstraints = {@UniqueConstraint(columnNames = "code")})
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Coupon extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CouponType type;

    @Column(name = "coupon_value", nullable = false)
    private BigDecimal value;

    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Integer maxUsages;

    @Column(nullable = false)
    @Builder.Default
    private Integer currentUsages = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

}
