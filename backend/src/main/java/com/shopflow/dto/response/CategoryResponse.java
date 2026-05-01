package com.shopflow.dto.response;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    @Builder.Default
    private List<CategoryResponse> children = java.util.ArrayList.newArrayList();
}

