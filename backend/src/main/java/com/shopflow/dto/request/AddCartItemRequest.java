package com.shopflow.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddCartItemRequest {
    private Long productId;
    private Long variantId; // nullable
    private Integer quantity;
}

