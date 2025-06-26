package com.licoreriabillar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// src/main/java/com/licoreriabillar/service/AuthResponse.java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDTO user;
}