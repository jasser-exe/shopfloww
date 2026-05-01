package com.shopflow.security;

public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // Legacy holder kept only to avoid breaking references; the active security
    // configuration lives in `com.shopflow.config.SecurityConfig`.
}

