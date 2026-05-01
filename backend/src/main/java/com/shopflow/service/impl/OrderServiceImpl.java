package com.shopflow.service.impl;

import com.shopflow.dto.request.PlaceOrderRequest;
import com.shopflow.dto.response.OrderItemResponse;
import com.shopflow.dto.response.OrderResponse;
import com.shopflow.entity.*;
import com.shopflow.exception.StockInsufficientException;
import com.shopflow.repository.*;
import com.shopflow.service.OrderService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;

    private static final BigDecimal SHIPPING_THRESHOLD = BigDecimal.valueOf(50);
    private static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(7);

    @Override
    @Transactional
    public OrderResponse placeOrder(Long customerId, PlaceOrderRequest request) {
        Cart cart = cartRepository.findByCustomerId(customerId).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        if (cart.getItems().isEmpty()) throw new IllegalArgumentException("Cart is empty");

        Address address = addressRepository.findByIdAndUserId(request.getAddressId(), customerId).orElseThrow(() -> new IllegalArgumentException("Address not found"));

        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            ProductVariant v = ci.getVariant();
            long available = p.getStock() + (v != null ? v.getExtraStock() : 0);
            if (ci.getQuantity() > available) {
                throw new StockInsufficientException("Product " + p.getName() + " has insufficient stock");
            }
        }

        var orderItems = new java.util.ArrayList<OrderItem>();
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            ProductVariant v = ci.getVariant();
            BigDecimal base = p.getPromoPrice() != null ? p.getPromoPrice() : p.getPrice();
            BigDecimal delta = v != null && v.getPriceDelta() != null ? v.getPriceDelta() : BigDecimal.ZERO;
            BigDecimal unitPrice = base.add(delta);
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem oi = OrderItem.builder()
                    .product(p)
                    .variant(v)
                    .quantity(ci.getQuantity())
                    .unitPrice(unitPrice)
                    .build();
            orderItems.add(oi);
        }

        BigDecimal shipping = subtotal.compareTo(SHIPPING_THRESHOLD) < 0 ? SHIPPING_FEE : BigDecimal.ZERO;
        BigDecimal discount = BigDecimal.ZERO;
        Coupon appliedCoupon = cart.getAppliedCoupon();
        if (appliedCoupon != null) {
            if (appliedCoupon.getType() == CouponType.PERCENT) {
                discount = subtotal.multiply(appliedCoupon.getValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            } else {
                discount = appliedCoupon.getValue();
            }
            if (discount.compareTo(subtotal) > 0) discount = subtotal;
        }
        BigDecimal total = subtotal.add(shipping).subtract(discount);

        User user = userRepository.findById(customerId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Order order = Order.builder()
                .customer(user)
                .status(OrderStatus.PENDING)
                .deliveryAddress(address.getStreet() + ", " + address.getCity() + " " + address.getPostalCode() + ", " + address.getCountry())
                .subTotal(subtotal)
                .shippingFee(shipping)
                .totalTTC(total)
                .build();
        order = orderRepository.save(order);

        for (OrderItem oi : orderItems) {
            oi.setOrder(order);
            orderItemRepository.save(oi);
        }
        order.setItems(orderItems);

        for (CartItem ci : cart.getItems()) {
            Product p = ci.getProduct();
            ProductVariant v = ci.getVariant();
            p.setStock(p.getStock() - ci.getQuantity());
            if (v != null) {
                v.setExtraStock(v.getExtraStock() - ci.getQuantity());
            }
            productRepository.save(p);
        }

        if (appliedCoupon != null) {
            appliedCoupon.setCurrentUsages(appliedCoupon.getCurrentUsages() + 1);
            couponRepository.save(appliedCoupon);
        }

        cart.getItems().clear();
        cart.setAppliedCoupon(null);
        cartRepository.save(cart);

        return mapToResponse(order, discount);
    }

    @Override
    public OrderResponse getOrderById(Long id, Long requesterId, Role role) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (role == Role.CUSTOMER && !order.getCustomer().getId().equals(requesterId)) {
            throw new IllegalArgumentException("Access denied");
        }
        BigDecimal discount = calculateDiscount(order);
        return mapToResponse(order, discount);
    }

    @Override
    public Page<OrderResponse> getMyOrders(Long customerId, Pageable pageable) {
        return orderRepository.findByCustomerIdOrderByOrderedAtDesc(customerId, pageable)
                .map(order -> mapToResponse(order, calculateDiscount(order)));
    }

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(order -> mapToResponse(order, calculateDiscount(order)));
    }

    @Override
    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatus newStatus, Long requesterId, Role role) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (role == Role.CUSTOMER) throw new IllegalArgumentException("Access denied");

        OrderStatus currentStatus = order.getStatus();
        validateStatusTransition(currentStatus, newStatus);
        order.setStatus(newStatus);
        orderRepository.save(order);
        BigDecimal discount = calculateDiscount(order);
        return mapToResponse(order, discount);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long customerId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (!order.getCustomer().getId().equals(customerId)) throw new IllegalArgumentException("Access denied");
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PAID) {
            throw new IllegalArgumentException("Cannot cancel order with status: " + order.getStatus());
        }

        boolean wasPaid = order.getStatus() == OrderStatus.PAID;

        for (OrderItem oi : order.getItems()) {
            Product p = oi.getProduct();
            ProductVariant v = oi.getVariant();
            p.setStock(p.getStock() + oi.getQuantity());
            if (v != null) {
                v.setExtraStock(v.getExtraStock() + oi.getQuantity());
            }
            productRepository.save(p);
        }

        order.setStatus(OrderStatus.CANCELLED);
        if (wasPaid) {
            order.setStatus(OrderStatus.REFUNDED);
        }
        orderRepository.save(order);
        BigDecimal discount = calculateDiscount(order);
        return mapToResponse(order, discount);
    }

    private void validateStatusTransition(OrderStatus from, OrderStatus to) {
        boolean valid = (from == OrderStatus.PENDING && (to == OrderStatus.PAID || to == OrderStatus.CANCELLED))
                || (from == OrderStatus.PAID && (to == OrderStatus.PROCESSING || to == OrderStatus.CANCELLED || to == OrderStatus.REFUNDED))
                || (from == OrderStatus.PROCESSING && (to == OrderStatus.SHIPPED || to == OrderStatus.CANCELLED))
                || (from == OrderStatus.SHIPPED && to == OrderStatus.DELIVERED);
        if (!valid) throw new IllegalArgumentException("Invalid status transition from " + from + " to " + to);
    }

    private BigDecimal calculateDiscount(Order order) {
        BigDecimal calculated = order.getSubTotal().add(order.getShippingFee()).subtract(order.getTotalTTC());
        return calculated.compareTo(BigDecimal.ZERO) > 0 ? calculated : BigDecimal.ZERO;
    }

    private OrderResponse mapToResponse(Order order, BigDecimal discount) {
        var items = order.getItems().stream().map(oi -> OrderItemResponse.builder()
                .id(oi.getId())
                .productId(oi.getProduct().getId())
                .productName(oi.getProduct().getName())
                .variantId(oi.getVariant() != null ? oi.getVariant().getId() : null)
                .variantAttribute(oi.getVariant() != null ? oi.getVariant().getAttribute() : null)
                .variantValue(oi.getVariant() != null ? oi.getVariant().getValue() : null)
                .quantity(oi.getQuantity())
                .unitPrice(oi.getUnitPrice())
                .totalPrice(oi.getUnitPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                .build()).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerId(order.getCustomer().getId())
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .items(items)
                .subTotal(order.getSubTotal())
                .shippingFee(order.getShippingFee())
                .discount(discount)
                .totalTTC(order.getTotalTTC())
                .appliedCouponCode(null)
                .orderedAt(order.getOrderedAt())
                .build();
    }
}



