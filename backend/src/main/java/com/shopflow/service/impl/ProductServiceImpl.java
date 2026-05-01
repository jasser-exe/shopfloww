package com.shopflow.service.impl;

import com.shopflow.dto.request.CreateProductRequest;
import com.shopflow.dto.request.ProductRequest;
import com.shopflow.dto.response.ProductResponse;
import com.shopflow.entity.Product;
import com.shopflow.entity.SellerProfile;
import com.shopflow.exception.ResourceNotFoundException;
import com.shopflow.mapper.ProductMapper;
import com.shopflow.repository.ProductRepository;
import com.shopflow.repository.ReviewRepository;
import com.shopflow.repository.SellerProfileRepository;
import com.shopflow.repository.UserRepository;
import com.shopflow.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;
    private final ProductMapper mapper;
    private final SellerProfileRepository sellerProfileRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public ProductResponse create(ProductRequest request) {
        Product p = mapper.toEntity(request);
        p = repository.save(p);
        return mapper.toResponse(p);
    }

    @Override
    public ProductResponse getById(Long id) {
        Product p = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapper.toResponse(p);
    }

    @Override
    public List<ProductResponse> getAll() {
        return repository.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public ProductResponse update(Long id, ProductRequest request) {
        Product p = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        p.setName(request.getName());
        p.setDescription(request.getDescription());
        p.setPrice(request.getPrice());
        p.setStock(request.getQuantity());
        p = repository.save(p);
        return mapper.toResponse(p);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Page<ProductResponse> getActiveProducts(Pageable pageable) {
        return repository.findByActiveTrue(pageable).map(p -> enrichProductResponse(p, mapper.toResponse(p)));
    }

    @Override
    public ProductResponse getProductById(Long id) {
        Product p = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return enrichProductResponse(p, mapper.toResponse(p));
    }

    @Override
    public ProductResponse createProduct(Long sellerId, CreateProductRequest request) {
        SellerProfile seller = sellerProfileRepository.findAll().stream()
                .filter(sp -> sp.getUser().getId().equals(sellerId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        Product product = Product.builder()
                .seller(seller)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .promoPrice(request.getPromoPrice())
                .stock(request.getStock())
                .active(true)
                .build();

        product = repository.save(product);
        return enrichProductResponse(product, mapper.toResponse(product));
    }

    @Override
    public ProductResponse updateProduct(Long id, Long userId, CreateProductRequest request) {
        Product product = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (product.getSeller() == null || !product.getSeller().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You do not own this product");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setPromoPrice(request.getPromoPrice());
        product.setStock(request.getStock());

        product = repository.save(product);
        return enrichProductResponse(product, mapper.toResponse(product));
    }

    @Override
    public void softDeleteProduct(Long id, Long userId) {
        Product product = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (product.getSeller() == null || !product.getSeller().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You do not own this product");
        }
        product.setActive(false);
        repository.save(product);
    }

    @Override
    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        return repository.searchByNameOrDescription(query, pageable).map(p -> enrichProductResponse(p, mapper.toResponse(p)));
    }

    @Override
    public List<ProductResponse> getTopSellingProducts() {
        return repository.findTop10ByOrderBySoldCountDesc().stream()
                .map(p -> enrichProductResponse(p, mapper.toResponse(p)))
                .collect(Collectors.toList());
    }

    private ProductResponse enrichProductResponse(Product product, ProductResponse response) {
        Double avgRating = reviewRepository.findAverageRatingByProductId(product.getId());
        response.setAverageRating(avgRating);
        if (product.getSeller() != null) {
            response.setSellerId(product.getSeller().getUser().getId());
            response.setSellerName(product.getSeller().getShopName());
        }
        return response;
    }
}



