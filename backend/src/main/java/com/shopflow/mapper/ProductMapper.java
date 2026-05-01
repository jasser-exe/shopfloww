package com.shopflow.mapper;

import com.shopflow.dto.request.ProductRequest;
import com.shopflow.dto.response.ProductResponse;
import com.shopflow.entity.Category;
import com.shopflow.entity.Product;
import org.mapstruct.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "soldCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "variants", ignore = true)
    @Mapping(target = "stock", source = "quantity")
    Product toEntity(ProductRequest request);

    @Mapping(target = "sellerId", source = "seller.id")
    @Mapping(target = "sellerName", source = "seller.shopName")
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "categories", qualifiedByName = "mapCategories")
    ProductResponse toResponse(Product product);

    @Named("mapCategories")
    static List<Map<String, Object>> mapCategories(Set<Category> categories) {
        if (categories == null) {
            return null;
        }
        return categories.stream()
                .map(category -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", category.getId());
                    map.put("name", category.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }
}