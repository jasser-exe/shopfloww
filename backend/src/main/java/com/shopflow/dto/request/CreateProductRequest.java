package com.shopflow.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateProductRequest {
    @NotBlank
    private String name;

    @Size(min = 10, max = 2000)
    private String description;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @DecimalMin("0.0")
    private BigDecimal promoPrice;

    @NotNull
    @Min(0)
    private Integer stock;

    private List<Long> categoryIds;
    private List<String> imageUrls;
}

