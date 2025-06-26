package com.licoreriabillar.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "detalles_venta")
public class VentaProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "venta_id")
    private Venta venta;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private java.math.BigDecimal precioUnitario;

    @Column(nullable = false)
    private java.math.BigDecimal subtotal;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    public VentaProducto() {}
} 