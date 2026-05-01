package com.shopflow.service;

import com.shopflow.dto.request.AddCartItemRequest;
import com.shopflow.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(Long customerId);
    CartResponse addItem(Long customerId, AddCartItemRequest request);
    CartResponse updateItemQuantity(Long customerId, Long itemId, int qty);
    CartResponse removeItem(Long customerId, Long itemId);
    CartResponse applyCoupon(Long customerId, String code);
    CartResponse removeCoupon(Long customerId);
}

