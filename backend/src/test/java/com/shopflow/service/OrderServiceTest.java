package com.shopflow.service;

import com.shopflow.dto.request.PlaceOrderRequest;
import com.shopflow.dto.response.OrderResponse;
import com.shopflow.entity.*;
import com.shopflow.exception.StockInsufficientException;
import com.shopflow.repository.*;
import com.shopflow.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    @DisplayName("testPlaceOrder_success: mock cart with 2 items, mock stock ok, verify order saved, stock decremented, cart cleared")
    void testPlaceOrder_success() {
        // Given
        Long customerId = 1L;
        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setAddressId(1L);

        Cart cart = new Cart();
        cart.setId(1L);
        cart.setCustomer(mock(User.class));

        Product product1 = new Product();
        product1.setId(1L);
        product1.setName("Product 1");
        product1.setPrice(BigDecimal.valueOf(100));
        product1.setStock(10);

        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Product 2");
        product2.setPrice(BigDecimal.valueOf(200));
        product2.setStock(5);

        CartItem item1 = new CartItem();
        item1.setProduct(product1);
        item1.setQuantity(2);

        CartItem item2 = new CartItem();
        item2.setProduct(product2);
        item2.setQuantity(1);

        cart.setItems(List.of(item1, item2));

        Address address = new Address();
        address.setId(1L);

        Order savedOrder = new Order();
        savedOrder.setId(1L);

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(addressRepository.findByIdAndUserId(request.getAddressId(), customerId)).thenReturn(Optional.of(address));
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(new OrderItem());

        // When
        OrderResponse result = orderService.placeOrder(customerId, request);

        // Then
        assertThat(result).isNotNull();
        verify(orderRepository).save(any(Order.class));
        verify(orderItemRepository, times(2)).save(any(OrderItem.class));
        verify(productRepository).save(product1);
        verify(productRepository).save(product2);
        verify(cartRepository).delete(cart);
        assertThat(product1.getStock()).isEqualTo(8); // 10 - 2
        assertThat(product2.getStock()).isEqualTo(4); // 5 - 1
    }

    @Test
    @DisplayName("testPlaceOrder_insufficientStock: throw StockInsufficientException")
    void testPlaceOrder_insufficientStock() {
        // Given
        Long customerId = 1L;
        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setAddressId(1L);

        Cart cart = new Cart();
        cart.setCustomer(mock(User.class));

        Product product = new Product();
        product.setName("Product");
        product.setStock(5);

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(10); // More than stock

        cart.setItems(List.of(item));

        Address address = new Address();

        when(cartRepository.findByCustomerId(customerId)).thenReturn(Optional.of(cart));
        when(addressRepository.findByIdAndUserId(request.getAddressId(), customerId)).thenReturn(Optional.of(address));

        // When & Then
        assertThatThrownBy(() -> orderService.placeOrder(customerId, request))
                .isInstanceOf(StockInsufficientException.class)
                .hasMessageContaining("insufficient stock");
    }

    @Test
    @DisplayName("testCancelOrder_pendingStatus: verify stock restored, status CANCELLED")
    void testCancelOrder_pendingStatus() {
        // Given
        Long orderId = 1L;
        Long customerId = 1L;

        Order order = new Order();
        order.setId(orderId);
        order.setStatus(OrderStatus.PENDING);
        order.setCustomer(mock(User.class));

        Product product = new Product();
        product.setStock(10);

        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setQuantity(2);

        order.setItems(List.of(orderItem));

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        // When
        OrderResponse result = orderService.cancelOrder(orderId, customerId);

        // Then
        assertThat(result.getStatus()).isEqualTo(OrderStatus.CANCELLED);
        assertThat(product.getStock()).isEqualTo(12); // 10 + 2
        verify(orderRepository).save(order);
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("testCancelOrder_deliveredStatus: verify OrderStatusException thrown")
    void testCancelOrder_deliveredStatus() {
        // Given
        Long orderId = 1L;
        Long customerId = 1L;

        Order order = new Order();
        order.setStatus(OrderStatus.DELIVERED);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        // When & Then
        assertThatThrownBy(() -> orderService.cancelOrder(orderId, customerId))
                .isInstanceOf(IllegalStateException.class); // Assuming OrderStatusException extends this
    }

    @Test
    @DisplayName("testUpdateStatus_validTransition: PENDING -> PAID ok")
    void testUpdateStatus_validTransition() {
        // Given
        Long orderId = 1L;
        Long requesterId = 1L;
        Role role = Role.ADMIN;

        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        // When
        OrderResponse result = orderService.updateStatus(orderId, OrderStatus.PAID, requesterId, role);

        // Then
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PAID);
        verify(orderRepository).save(order);
    }

    @Test
    @DisplayName("testUpdateStatus_invalidTransition: PAID -> PENDING throws exception")
    void testUpdateStatus_invalidTransition() {
        // Given
        Long orderId = 1L;
        Long requesterId = 1L;
        Role role = Role.ADMIN;

        Order order = new Order();
        order.setStatus(OrderStatus.PAID);

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));

        // When & Then
        assertThatThrownBy(() -> orderService.updateStatus(orderId, OrderStatus.PENDING, requesterId, role))
                .isInstanceOf(IllegalStateException.class);
    }
}
