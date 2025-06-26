package com.licoreriabillar.dto;

import com.licoreriabillar.enums.Rol;
import lombok.Data;

@Data
public class UsuarioRequest {
    private String nombreUsuario;
    private String password;
    private String nombreCompleto;
    private Rol rol;
}