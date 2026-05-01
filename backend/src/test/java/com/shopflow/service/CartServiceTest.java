package com.shopflow.service;

import com.shopflow.dto.request.AddCartItemRequest;
import com.shopflow.dto.response.CartResponse;
import com.shopflow.entity.*;
import com.shopflow.exception.CouponInvalidException;
import com.shopflow.exception.StockInsufficientException;
import com.shopflow.repository.*;
import com.shopflow.service.impl.CartServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    @Test
    @DisplayName("testAddItem_newItem: verify CartItem created")
    void testAddItem_newItem() {
        // Given
        Long customerId = 1L;
        AddCartItemRequest request = new AddCartItemRequest();
        request.setProductId(1L);
        request.setQuantity(2);

        Cart cart = new Cart();
        cart.setId(1L);

        Product product = new Product();
        product.setId(1L);
        product.setStock(10);

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(productRepository.findById(request.getProductId())).thenReturn(Optional.of(product));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(new CartItem());

        // When
        CartResponse result = cartService.addItem(customerId, request);

        // Then
        assertThat(result).isNotNull();
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    @DisplayName("testAddItem_existingItem: verify quantity incremented")
    void testAddItem_existingItem() {
        // Given
        Long customerId = 1L;
        AddCartItemRequest request = new AddCartItemRequest();
        request.setProductId(1L);
        request.setQuantity(3);

        Cart cart = new Cart();
        cart.setId(1L);

        Product product = new Product();
        product.setId(1L);
        product.setStock(10);

        CartItem existingItem = new CartItem();
        existingItem.setProduct(product);
        existingItem.setQuantity(2);

        cart.setItems(List.of(existingItem));

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(productRepository.findById(request.getProductId())).thenReturn(Optional.of(product));

        // When
        CartResponse result = cartService.addItem(customerId, request);

        // Then
        assertThat(existingItem.getQuantity()).isEqualTo(5); // 2 + 3
        verify(cartItemRepository).save(existingItem);
    }

    @Test
    @DisplayName("testAddItem_stockExceeded: verify exception")
    void testAddItem_stockExceeded() {
        // Given
        Long customerId = 1L;
        AddCartItemRequest request = new AddCartItemRequest();
        request.setProductId(1L);
        request.setQuantity(15);

        Cart cart = new Cart();

        Product product = new Product();
        product.setStock(10);

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(productRepository.findById(request.getProductId())).thenReturn(Optional.of(product));

        // When & Then
        assertThatThrownBy(() -> cartService.addItem(customerId, request))
                .isInstanceOf(StockInsufficientException.class);
    }

    @Test
    @DisplayName("testApplyCoupon_valid: verify discount applied")
    void testApplyCoupon_valid() {
        // Given
        Long customerId = 1L;
        String code = "VALID10";

        Cart cart = new Cart();
        cart.setTotal(BigDecimal.valueOf(100));

        Coupon coupon = new Coupon();
        coupon.setCode(code);
        coupon.setType(CouponType.PERCENTAGE);
        coupon.setValue(BigDecimal.valueOf(10));
        coupon.setActive(true);
        coupon.setExpiresAt(LocalDateTime.now().plusDays(1));

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(couponRepository.findByCode(code)).thenReturn(Optional.of(coupon));

        // When
        CartResponse result = cartService.applyCoupon(customerId, code);

        // Then
        assertThat(result).isNotNull();
        assertThat(cart.getCoupon()).isEqualTo(coupon);
        verify(cartRepository).save(cart);
    }

    @Test
    @DisplayName("testApplyCoupon_expired: verify CouponInvalidException")
    void testApplyCoupon_expired() {
        // Given
        Long customerId = 1L;
        String code = "EXPIRED";

        Cart cart = new Cart();

        Coupon coupon = new Coupon();
        coupon.setCode(code);
        coupon.setActive(true);
        coupon.setExpiresAt(LocalDateTime.now().minusDays(1)); // Expired

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(couponRepository.findByCode(code)).thenReturn(Optional.of(coupon));

        // When & Then
        assertThatThrownBy(() -> cartService.applyCoupon(customerId, code))
                .isInstanceOf(CouponInvalidException.class);
    }
}
