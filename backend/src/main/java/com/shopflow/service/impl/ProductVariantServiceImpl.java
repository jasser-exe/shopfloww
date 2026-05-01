package com.shopflow.service.impl;

import com.shopflow.dto.request.CreateVariantRequest;
import com.shopflow.dto.response.ProductVariantResponse;
import com.shopflow.entity.Product;
import com.shopflow.entity.ProductVariant;
import com.shopflow.repository.ProductRepository;
import com.shopflow.repository.ProductVariantRepository;
import com.shopflow.service.ProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductRepository productRepository;

    @Override
    public List<ProductVariantResponse> getVariantsByProduct(Long productId) {
        return productVariantRepository.findAll().stream()
                .filter(v -> v.getProduct().getId().equals(productId))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProductVariantResponse createVariant(Long productId, Long userId, CreateVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        // TODO: verify ownership - check that userId owns the product
        if (product.getSeller() == null || !product.getSeller().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You do not own this product");
        }

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .attribute(request.getAttribute())
                .value(request.getValue())
                .extraStock(request.getExtraStock())
                .priceDelta(request.getPriceDelta())
                .build();

        variant = productVariantRepository.save(variant);
        return mapToResponse(variant);
    }

    @Override
    public ProductVariantResponse updateVariant(Long variantId, Long userId, CreateVariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variant not found"));

        // TODO: verify ownership
        if (variant.getProduct().getSeller() == null || !variant.getProduct().getSeller().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You do not own this product");
        }

        variant.setAttribute(request.getAttribute());
        variant.setValue(request.getValue());
        variant.setExtraStock(request.getExtraStock());
        variant.setPriceDelta(request.getPriceDelta());

        variant = productVariantRepository.save(variant);
        return mapToResponse(variant);
    }

    @Override
    public void deleteVariant(Long variantId, Long userId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new IllegalArgumentException("Variant not found"));

        // TODO: verify ownership
        if (variant.getProduct().getSeller() == null || !variant.getProduct().getSeller().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You do not own this product");
        }

        productVariantRepository.delete(variant);
    }

    private ProductVariantResponse mapToResponse(ProductVariant variant) {
        return ProductVariantResponse.builder()
                .id(variant.getId())
                .attribute(variant.getAttribute())
                .value(variant.getValue())
                .extraStock(variant.getExtraStock())
                .priceDelta(variant.getPriceDelta())
                .build();
    }
}

