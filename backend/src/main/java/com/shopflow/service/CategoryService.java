package com.shopflow.service;

import com.shopflow.dto.request.CreateCategoryRequest;
import com.shopflow.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategoriesAsTree();
    CategoryResponse createCategory(CreateCategoryRequest request);
    CategoryResponse updateCategory(Long id, CreateCategoryRequest request);
    void deleteCategory(Long id);
}

