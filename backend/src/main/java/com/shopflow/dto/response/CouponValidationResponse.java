package com.shopflow.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponValidationResponse {
    private boolean valid;
    private String code;
    private String type;
    private BigDecimal value;
    private String message;
}

