package com.shopflow.service.impl;

import com.shopflow.dto.request.LoginRequest;
import com.shopflow.dto.request.RegisterRequest;
import com.shopflow.dto.response.AuthResponse;
import com.shopflow.dto.response.UserResponse;
import com.shopflow.entity.RefreshToken;
import com.shopflow.repository.RefreshTokenRepository;
import com.shopflow.repository.UserRepository;
import com.shopflow.security.JwtUtil;
import com.shopflow.service.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
// using fully-qualified UserDetails and User in code to avoid import name clash with entity.User
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        com.shopflow.entity.User user = com.shopflow.entity.User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
                .active(true)
                .build();
        user = userRepository.save(user);
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        com.shopflow.entity.User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshTokenStr = jwtUtil.generateRefreshToken(userDetails);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenStr)
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .used(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public AuthResponse refresh(String refreshTokenStr) {
        Optional<RefreshToken> maybe = refreshTokenRepository.findByToken(refreshTokenStr);
        RefreshToken refreshToken = maybe.orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (refreshToken.isUsed() || refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token expired or used");
        }

        org.springframework.security.core.userdetails.UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(refreshToken.getUser().getEmail())
                .password(refreshToken.getUser().getPassword())
                .roles(refreshToken.getUser().getRole().name())
                .build();

        String newAccess = jwtUtil.generateAccessToken(userDetails);
        return AuthResponse.builder()
                .accessToken(newAccess)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .userId(refreshToken.getUser().getId())
                .role(refreshToken.getUser().getRole().name())
                .build();
    }

    @Override
    public void logout(String refreshTokenStr) {
        refreshTokenRepository.deleteByToken(refreshTokenStr);
    }
}


