package com.licoreriabillar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioVenta;

    @Column(precision = 10, scale = 2)
    private BigDecimal precioCompra;

    @Column(nullable = false)
    private Double stockActual = 0.0;

    @Column(unique = true)
    private String codigoBarras;

    @Column(length = 50)
    private String unidadMedida;

    @Column(precision = 10, scale = 2)
    private BigDecimal volumenMl;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column
    private LocalDateTime ultimaActualizacion;

    @Column
    private LocalDateTime fechaCreacion;

    @Column(columnDefinition = "LONGTEXT")
    private String imagen;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        ultimaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ultimaActualizacion = LocalDateTime.now();
    }
}