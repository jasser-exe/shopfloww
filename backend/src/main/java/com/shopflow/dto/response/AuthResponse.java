package com.shopflow.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    // legacy single token field (kept for backward compatibility)
    private String token;

    // new structured tokens
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long userId;
    private String role;

    public AuthResponse(String token) {
        this.token = token;
    }
}

