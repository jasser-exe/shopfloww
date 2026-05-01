package com.shopflow.dto.response;

import com.shopflow.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;
}

