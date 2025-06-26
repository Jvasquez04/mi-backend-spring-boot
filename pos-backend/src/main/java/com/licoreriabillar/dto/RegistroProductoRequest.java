package com.licoreriabillar.dto;

import java.math.BigDecimal;

public class RegistroProductoRequest {
    public String nombre;
    public String descripcion;
    public BigDecimal precioVenta;
    public Double stockActual;
    public Long categoriaId;
    public String imagen;
}