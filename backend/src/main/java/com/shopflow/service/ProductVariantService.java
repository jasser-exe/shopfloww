package com.shopflow.service;

import com.shopflow.dto.request.CreateVariantRequest;
import com.shopflow.dto.response.ProductVariantResponse;

import java.util.List;

public interface ProductVariantService {
    List<ProductVariantResponse> getVariantsByProduct(Long productId);
    ProductVariantResponse createVariant(Long productId, Long userId, CreateVariantRequest request);
    ProductVariantResponse updateVariant(Long variantId, Long userId, CreateVariantRequest request);
    void deleteVariant(Long variantId, Long userId);
}

