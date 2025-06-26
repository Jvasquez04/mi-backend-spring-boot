package com.licoreriabillar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String nombreUsuario;
    private String nombreCompleto;
    private String rol;
}
