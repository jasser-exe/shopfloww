package com.shopflow.dto.response;

import com.shopflow.entity.CouponType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponResponse {
    private Long id;
    private String code;
    private CouponType type;
    private BigDecimal value;
    private LocalDateTime expiresAt;
    private Integer maxUsages;
    private Integer currentUsages;
    private boolean active;
}

