package com.shopflow.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long variantId;
    private String variantAttribute;
    private String variantValue;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
}

