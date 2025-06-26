package com.licoreriabillar.dto;

import lombok.Data;

@Data
public class RegistroRequest {
    private String username;
    private String password;
    private String nombreCompleto;
    private String rol;
} 