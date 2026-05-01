package com.shopflow.service.impl;

import com.shopflow.dto.request.AddCartItemRequest;
import com.shopflow.dto.response.CartItemResponse;
import com.shopflow.dto.response.CartResponse;
import com.shopflow.entity.Cart;
import com.shopflow.entity.CartItem;
import com.shopflow.entity.Coupon;
import com.shopflow.entity.Product;
import com.shopflow.entity.ProductVariant;
import com.shopflow.exception.CouponInvalidException;
import com.shopflow.exception.StockInsufficientException;
import com.shopflow.repository.*;
import com.shopflow.service.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    // cartItemRepository not required because Cart cascade persists items
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CouponRepository couponRepository;

    private static final BigDecimal SHIPPING_THRESHOLD = BigDecimal.valueOf(50);
    private static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(7);

    @Override
    public CartResponse getCart(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId).orElseGet(() -> createEmptyCart(customerId));
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItem(Long customerId, AddCartItemRequest request) {
        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new IllegalArgumentException("Product not found"));
        if (!product.isActive()) throw new IllegalArgumentException("Product is not active");

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = productVariantRepository.findById(request.getVariantId()).orElseThrow(() -> new IllegalArgumentException("Variant not found"));
        }

        int qty = request.getQuantity() == null ? 1 : request.getQuantity();

        long available = product.getStock() + (variant != null ? variant.getExtraStock() : 0);
        if (qty > available) throw new StockInsufficientException("Requested quantity exceeds available stock");

        Cart cart = cartRepository.findByCustomerId(customerId).orElseGet(() -> createEmptyCart(customerId));

        final Long productId = product.getId();
        final Long variantId = variant != null ? variant.getId() : null;
        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId) && ((i.getVariant() == null && variantId == null) || (i.getVariant() != null && variantId != null && i.getVariant().getId().equals(variantId))))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty = item.getQuantity() + qty;
            if (newQty > available) throw new StockInsufficientException("Not enough stock to increase quantity");
            item.setQuantity(newQty);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .variant(variant)
                    .quantity(qty)
                    .build();
            cart.getItems().add(item);
        }

        cart = cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItemQuantity(Long customerId, Long itemId, int qty) {
        Cart cart = cartRepository.findByCustomerId(customerId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        CartItem item = cart.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst().orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        Product product = item.getProduct();
        ProductVariant variant = item.getVariant();
        long available = product.getStock() + (variant != null ? variant.getExtraStock() : 0);

        if (qty == 0) {
            cart.getItems().remove(item);
            cartRepository.save(cart);
            return mapToResponse(cart);
        }

        if (qty > available) throw new StockInsufficientException("Requested quantity exceeds available stock");
        item.setQuantity(qty);
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long customerId, Long itemId) {
        Cart cart = cartRepository.findByCustomerId(customerId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse applyCoupon(Long customerId, String code) {
        Cart cart = cartRepository.findByCustomerId(customerId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        Coupon coupon = couponRepository.findByCodeAndActiveTrue(code).orElseThrow(() -> new CouponInvalidException("Coupon not found or inactive"));
        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(LocalDateTime.now())) throw new CouponInvalidException("Coupon expired");
        if (coupon.getMaxUsages() != null && coupon.getCurrentUsages() != null && coupon.getCurrentUsages() >= coupon.getMaxUsages()) throw new CouponInvalidException("Coupon usage limit reached");

        cart.setAppliedCoupon(coupon);
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeCoupon(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        cart.setAppliedCoupon(null);
        cartRepository.save(cart);
        return mapToResponse(cart);
    }

    // Helpers
    private Cart createEmptyCart(Long customerId) {
        com.shopflow.entity.User user = userRepository.findById(customerId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Cart cart = Cart.builder().customer(user).build();
        return cartRepository.save(cart);
    }

    private CartResponse mapToResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(this::mapItem).collect(Collectors.toList());
        BigDecimal subtotal = items.stream().map(CartItemResponse::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shipping = subtotal.compareTo(SHIPPING_THRESHOLD) < 0 ? SHIPPING_FEE : BigDecimal.ZERO;
        BigDecimal discount = BigDecimal.ZERO;
        if (cart.getAppliedCoupon() != null) {
            Coupon c = cart.getAppliedCoupon();
            if (c.getType() == com.shopflow.entity.CouponType.PERCENT) {
                discount = subtotal.multiply(c.getValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            } else {
                discount = c.getValue();
            }
            if (discount.compareTo(subtotal) > 0) discount = subtotal;
        }
        BigDecimal total = subtotal.add(shipping).subtract(discount);
        return CartResponse.builder()
                .items(items)
                .subtotal(subtotal)
                .shippingFee(shipping)
                .discount(discount)
                .total(total)
                .appliedCouponCode(cart.getAppliedCoupon() != null ? cart.getAppliedCoupon().getCode() : null)
                .build();
    }

    private CartItemResponse mapItem(CartItem item) {
        Product p = item.getProduct();
        ProductVariant v = item.getVariant();
        BigDecimal base = p.getPromoPrice() != null ? p.getPromoPrice() : p.getPrice();
        BigDecimal delta = v != null && v.getPriceDelta() != null ? v.getPriceDelta() : BigDecimal.ZERO;
        BigDecimal unit = base.add(delta);
        BigDecimal total = unit.multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemResponse.builder()
                .id(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .variantId(v != null ? v.getId() : null)
                .variantAttribute(v != null ? v.getAttribute() : null)
                .variantValue(v != null ? v.getValue() : null)
                .unitPrice(unit)
                .quantity(item.getQuantity())
                .totalPrice(total)
                .build();
    }
}


