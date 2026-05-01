package com.shopflow.service.impl;

import com.shopflow.dto.request.CreateCategoryRequest;
import com.shopflow.dto.response.CategoryResponse;
import com.shopflow.entity.Category;
import com.shopflow.repository.CategoryRepository;
import com.shopflow.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategoriesAsTree() {
        List<Category> rootCategories = categoryRepository.findByParentIsNull();
        return rootCategories.stream()
                .map(this::buildCategoryTree)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        Category parent = null;
        if (request.getParentId() != null) {
            parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .parent(parent)
                .build();
        category = categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CreateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent category not found"));
            category.setParent(parent);
        }

        category = categoryRepository.save(category);
        return mapToResponse(category);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        categoryRepository.delete(category);
    }

    private CategoryResponse buildCategoryTree(Category category) {
        List<CategoryResponse> children = category.getChildren().stream()
                .map(this::buildCategoryTree)
                .collect(Collectors.toList());

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .children(children)
                .build();
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .children(category.getChildren().stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList()))
                .build();
    }
}

