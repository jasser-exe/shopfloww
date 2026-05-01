package com.shopflow.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantResponse {
    private Long id;
    private String attribute;
    private String value;
    private Integer extraStock;
    private BigDecimal priceDelta;
}

