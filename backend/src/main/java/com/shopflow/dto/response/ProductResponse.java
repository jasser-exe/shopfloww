package com.shopflow.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal promoPrice;
    private Integer stock;
    private Long soldCount;
    private boolean active;
    private Long sellerId;
    private String sellerName;
    private Double averageRating;
    private List<String> images;
    private List<Map<String, Object>> categories;
    private LocalDateTime createdAt;
}

