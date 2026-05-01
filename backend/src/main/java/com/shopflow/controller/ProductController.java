package com.shopflow.controller;

import com.shopflow.dto.request.CreateProductRequest;
import com.shopflow.dto.response.ProductResponse;
import com.shopflow.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management endpoints")
public class ProductController {

    private final ProductService productService;

    private Long getCurrentUserId(@SuppressWarnings("unused") Authentication auth) {
        // TODO: extract user ID from JWT token in auth
        return 1L;
    }

    @GetMapping
    @Operation(summary = "Get products", description = "Retrieve a paginated list of products with optional filters")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    public ResponseEntity<Page<ProductResponse>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long sellerId,
            @RequestParam(required = false) Boolean onPromo,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        // TODO: implement filter logic in ProductService
        // For now, categoryId, minPrice, maxPrice, sellerId, onPromo, search are accepted but not used
        Page<ProductResponse> products = productService.getActiveProducts(pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve a single product by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @Operation(summary = "Create product", description = "Create a new product (Seller/Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ProductResponse> createProduct(
            Authentication auth,
            @Valid @RequestBody CreateProductRequest request) {
        Long sellerId = getCurrentUserId(auth);
        ProductResponse product = productService.createProduct(sellerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @Operation(summary = "Update product", description = "Update an existing product (Seller/Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ProductResponse> updateProduct(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody CreateProductRequest request) {
        Long userId = getCurrentUserId(auth);
        return ResponseEntity.ok(productService.updateProduct(id, userId, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    @Operation(summary = "Delete product", description = "Soft delete a product (Seller/Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product deleted successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<Void> deleteProduct(
            Authentication auth,
            @PathVariable Long id) {
        Long userId = getCurrentUserId(auth);
        productService.softDeleteProduct(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search products", description = "Search products by query string")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid search query")
    })
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String q,
            Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(q, pageable));
    }

    @GetMapping("/top-selling")
    @Operation(summary = "Get top selling products", description = "Retrieve a list of top selling products")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Top selling products retrieved successfully")
    })
    public ResponseEntity<List<ProductResponse>> getTopSellingProducts() {
        return ResponseEntity.ok(productService.getTopSellingProducts());
    }
}
