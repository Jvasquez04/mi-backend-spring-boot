package com.licoreriabillar.dto;

import lombok.Data;

@Data
public class LoginRequest {
    public String nombreUsuario;
    public String password;
}