package com.shopflow.service;

import com.shopflow.dto.request.CreateProductRequest;
import com.shopflow.dto.response.ProductResponse;
import com.shopflow.entity.Product;
import com.shopflow.entity.SellerProfile;
import com.shopflow.exception.ForbiddenException;
import com.shopflow.mapper.ProductMapper;
import com.shopflow.repository.ProductRepository;
import com.shopflow.repository.ReviewRepository;
import com.shopflow.repository.SellerProfileRepository;
import com.shopflow.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private SellerProfileRepository sellerProfileRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    @DisplayName("testCreateProduct_sellerExists: verify saved")
    void testCreateProduct_sellerExists() {
        // Given
        Long sellerId = 1L;
        CreateProductRequest request = new CreateProductRequest();
        request.setName("Test Product");
        request.setPrice(BigDecimal.valueOf(100));

        SellerProfile seller = new SellerProfile();
        seller.setId(sellerId);

        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());

        ProductResponse response = new ProductResponse();
        response.setName(request.getName());

        when(sellerProfileRepository.findById(sellerId)).thenReturn(Optional.of(seller));
        when(productMapper.toEntity(request)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toResponse(product)).thenReturn(response);

        // When
        ProductResponse result = productService.createProduct(sellerId, request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo(request.getName());
        verify(productRepository).save(product);
        verify(productMapper).toResponse(product);
    }

    @Test
    @DisplayName("testSoftDelete_notOwner: verify ForbiddenException")
    void testSoftDelete_notOwner() {
        // Given
        Long productId = 1L;
        Long userId = 1L;

        Product product = new Product();
        product.setId(productId);
        product.setActive(true);

        SellerProfile owner = new SellerProfile();
        owner.setId(2L); // Different seller

        product.setSeller(owner);

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // When & Then
        assertThatThrownBy(() -> productService.softDeleteProduct(productId, userId))
                .isInstanceOf(ForbiddenException.class);
    }
}
