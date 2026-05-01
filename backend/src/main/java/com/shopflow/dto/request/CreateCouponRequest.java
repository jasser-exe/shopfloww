package com.shopflow.dto.request;

import com.shopflow.entity.CouponType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCouponRequest {
    @NotBlank
    private String code;

    @NotNull
    private CouponType type;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal value;

    private LocalDateTime expiresAt;

    @NotNull
    @Min(1)
    private Integer maxUsages;

    @Builder.Default
    private boolean active = true;
}

