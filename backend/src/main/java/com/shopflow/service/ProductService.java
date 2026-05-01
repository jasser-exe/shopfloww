package com.shopflow.service;

import com.shopflow.dto.request.CreateProductRequest;
import com.shopflow.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    // Legacy methods (deprecated)
    ProductResponse create(com.shopflow.dto.request.ProductRequest request);
    ProductResponse getById(Long id);
    List<ProductResponse> getAll();
    ProductResponse update(Long id, com.shopflow.dto.request.ProductRequest request);
    void delete(Long id);

    // New methods
    Page<ProductResponse> getActiveProducts(Pageable pageable);
    ProductResponse getProductById(Long id);
    ProductResponse createProduct(Long sellerId, CreateProductRequest request);
    ProductResponse updateProduct(Long id, Long userId, CreateProductRequest request);
    void softDeleteProduct(Long id, Long userId);
    Page<ProductResponse> searchProducts(String query, Pageable pageable);
    List<ProductResponse> getTopSellingProducts();
}


