package com.shopflow.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSummary {
    private Long id;
    private String name;
    private Long soldCount;
    private BigDecimal price;
    private Integer stock;
}

