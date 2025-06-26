package com.licoreriabillar.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String descripcion;
    private String codigoBarras;
    private String unidadMedida;
    private Integer volumenMl;
    private BigDecimal precioCompra;
    private BigDecimal precioVenta;
    private Integer stockActual;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimaActualizacion;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    @JsonBackReference
    private Categoria categoria;

    @Column(columnDefinition = "LONGTEXT")
    private String imagen;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCodigoBarras() { return codigoBarras; }
    public void setCodigoBarras(String codigoBarras) { this.codigoBarras = codigoBarras; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public Integer getVolumenMl() { return volumenMl; }
    public void setVolumenMl(Integer volumenMl) { this.volumenMl = volumenMl; }

    public BigDecimal getPrecioCompra() { return precioCompra; }
    public void setPrecioCompra(BigDecimal precioCompra) { this.precioCompra = precioCompra; }

    public BigDecimal getPrecioVenta() { return precioVenta; }
    public void setPrecioVenta(BigDecimal precioVenta) { this.precioVenta = precioVenta; }

    public Integer getStockActual() { return stockActual; }
    public void setStockActual(Integer stockActual) { this.stockActual = stockActual; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getUltimaActualizacion() { return ultimaActualizacion; }
    public void setUltimaActualizacion(LocalDateTime ultimaActualizacion) { this.ultimaActualizacion = ultimaActualizacion; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
} 