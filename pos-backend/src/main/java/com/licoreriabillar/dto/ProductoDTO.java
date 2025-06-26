package com.licoreriabillar.dto;

public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precioVenta;
    private Double precioCompra;
    private Double stockActual;
    private Boolean activo;
    private Long categoriaId; // Solo el ID de la categoría
    private String imagen;    // <--- Campo de imagen

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getPrecioVenta() { return precioVenta; }
    public void setPrecioVenta(Double precioVenta) { this.precioVenta = precioVenta; }
    public Double getPrecioCompra() { return precioCompra; }
    public void setPrecioCompra(Double precioCompra) { this.precioCompra = precioCompra; }
    public Double getStockActual() { return stockActual; }
    public void setStockActual(Double stockActual) { this.stockActual = stockActual; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}