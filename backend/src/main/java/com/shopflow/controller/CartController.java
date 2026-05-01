package com.shopflow.controller;

import com.shopflow.dto.request.AddCartItemRequest;
import com.shopflow.dto.response.CartResponse;
import com.shopflow.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
@Tag(name = "Cart", description = "Shopping cart management endpoints")
public class CartController {

    private final CartService cartService;

    private Long getCurrentUserId(@SuppressWarnings("unused") Authentication auth) {
        // TODO: extract user ID from JWT token in auth
        return 1L; // placeholder
    }

    @GetMapping
    @Operation(summary = "Get cart", description = "Retrieve the current user's shopping cart")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cart retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<CartResponse> getCart(Authentication auth) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.ok(cartService.getCart(customerId));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart", description = "Add a product variant to the shopping cart")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item added successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<CartResponse> addItem(Authentication auth, @RequestBody AddCartItemRequest request) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.ok(cartService.addItem(customerId, request));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update item quantity", description = "Update the quantity of a cart item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Quantity updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid quantity"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Item not found")
    })
    public ResponseEntity<CartResponse> updateItemQuantity(Authentication auth, @PathVariable Long itemId, @RequestBody UpdateQuantityRequest request) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.ok(cartService.updateItemQuantity(customerId, itemId, request.getQuantity()));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart", description = "Remove an item from the shopping cart")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item removed successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Item not found")
    })
    public ResponseEntity<CartResponse> removeItem(Authentication auth, @PathVariable Long itemId) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.ok(cartService.removeItem(customerId, itemId));
    }

    @PostMapping("/coupon")
    @Operation(summary = "Apply coupon", description = "Apply a coupon code to the cart")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coupon applied successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid coupon code"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<CartResponse> applyCoupon(Authentication auth, @RequestBody ApplyCouponRequest request) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.ok(cartService.applyCoupon(customerId, request.getCode()));
    }

    @DeleteMapping("/coupon")
    @Operation(summary = "Remove coupon", description = "Remove the applied coupon from the cart")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Coupon removed successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<CartResponse> removeCoupon(Authentication auth) {
        Long customerId = getCurrentUserId(auth);
        return ResponseEntity.ok(cartService.removeCoupon(customerId));
    }

    // Inner DTOs
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ApplyCouponRequest {
        private String code;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class UpdateQuantityRequest {
        private Integer quantity;
    }
}
