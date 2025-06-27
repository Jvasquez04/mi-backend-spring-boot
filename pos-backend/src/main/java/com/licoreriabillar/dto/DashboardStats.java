package com.licoreriabillar.dto;

import java.math.BigDecimal;

public class DashboardStats {
    private int totalVentas;
    private int totalProductos;
    private int totalCategorias;
    private int ventasHoy;
    private BigDecimal ingresosHoy;
    private BigDecimal ingresosMes;

    public DashboardStats() {}

    public int getTotalVentas() {
        return totalVentas;
    }

    public void setTotalVentas(int totalVentas) {
        this.totalVentas = totalVentas;
    }

    public int getTotalProductos() {
        return totalProductos;
    }

    public void setTotalProductos(int totalProductos) {
        this.totalProductos = totalProductos;
    }

    public int getTotalCategorias() {
        return totalCategorias;
    }

    public void setTotalCategorias(int totalCategorias) {
        this.totalCategorias = totalCategorias;
    }

    public int getVentasHoy() {
        return ventasHoy;
    }

    public void setVentasHoy(int ventasHoy) {
        this.ventasHoy = ventasHoy;
    }

    public BigDecimal getIngresosHoy() {
        return ingresosHoy;
    }

    public void setIngresosHoy(BigDecimal ingresosHoy) {
        this.ingresosHoy = ingresosHoy;
    }

    public BigDecimal getIngresosMes() {
        return ingresosMes;
    }

    public void setIngresosMes(BigDecimal ingresosMes) {
        this.ingresosMes = ingresosMes;
    }
} 