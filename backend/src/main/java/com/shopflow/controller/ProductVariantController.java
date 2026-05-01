package com.shopflow.controller;

import com.shopflow.dto.request.CreateVariantRequest;
import com.shopflow.dto.response.ProductVariantResponse;
import com.shopflow.service.ProductVariantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/variants")
@RequiredArgsConstructor
@Tag(name = "Product Variants", description = "Product variant management endpoints")
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    private Long getCurrentUserId(@SuppressWarnings("unused") Authentication auth) {
        // TODO: extract user ID from JWT token in auth
        return 1L;
    }

    @GetMapping
    @Operation(summary = "Get product variants", description = "Retrieve all variants for a specific product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Variants retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<List<ProductVariantResponse>> getProductVariants(@PathVariable Long productId) {
        return ResponseEntity.ok(productVariantService.getVariantsByProduct(productId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @Operation(summary = "Create variant", description = "Create a new variant for a product (Seller/Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Variant created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ProductVariantResponse> createVariant(
            Authentication auth,
            @PathVariable Long productId,
            @Valid @RequestBody CreateVariantRequest request) {
        Long userId = getCurrentUserId(auth);
        ProductVariantResponse variant = productVariantService.createVariant(productId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(variant);
    }

    @PutMapping("/{variantId}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @Operation(summary = "Update variant", description = "Update an existing product variant (Seller/Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Variant updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Variant not found")
    })
    public ResponseEntity<ProductVariantResponse> updateVariant(
            Authentication auth,
            @PathVariable Long productId,
            @PathVariable Long variantId,
            @Valid @RequestBody CreateVariantRequest request) {
        Long userId = getCurrentUserId(auth);
        // productId is in the path for clarity but validation is done in service
        ProductVariantResponse variant = productVariantService.updateVariant(variantId, userId, request);
        return ResponseEntity.ok(variant);
    }

    @DeleteMapping("/{variantId}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @Operation(summary = "Delete variant", description = "Delete a product variant (Seller/Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Variant deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Variant not found")
    })
    public ResponseEntity<Void> deleteVariant(
            Authentication auth,
            @PathVariable Long productId,
            @PathVariable Long variantId) {
        Long userId = getCurrentUserId(auth);
        // productId is in the path for clarity but validation is done in service
        productVariantService.deleteVariant(variantId, userId);
        return ResponseEntity.noContent().build();
    }
}
