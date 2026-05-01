package com.shopflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateVariantRequest {
    @NotBlank
    private String attribute;

    @NotBlank
    private String value;

    @NotNull
    private Integer extraStock;

    @Builder.Default
    private BigDecimal priceDelta = BigDecimal.ZERO;
}

