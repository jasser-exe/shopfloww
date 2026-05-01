package com.shopflow.dto.response;

import com.shopflow.entity.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private Long customerId;
    private OrderStatus status;
    private String deliveryAddress;
    private List<OrderItemResponse> items;
    private BigDecimal subTotal;
    private BigDecimal shippingFee;
    private BigDecimal discount;
    private BigDecimal totalTTC;
    private String appliedCouponCode;
    private LocalDateTime orderedAt;
}

