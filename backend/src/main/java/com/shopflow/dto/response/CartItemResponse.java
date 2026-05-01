package com.shopflow.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long variantId;
    private String variantAttribute;
    private String variantValue;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
}

