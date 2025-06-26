package com.licoreriabillar.dto;

public class DashboardStats {
    private int productosActivos;
    private int ventasHoy;
    private double ingresosHoy;
    private int productosBajos;
    private int productosVendidos;

    public DashboardStats() {}
    public DashboardStats(int productosActivos, int ventasHoy, double ingresosHoy, int productosBajos) {
        this.productosActivos = productosActivos;
        this.ventasHoy = ventasHoy;
        this.ingresosHoy = ingresosHoy;
        this.productosBajos = productosBajos;
    }
    public int getProductosActivos() { return productosActivos; }
    public void setProductosActivos(int productosActivos) { this.productosActivos = productosActivos; }
    public int getVentasHoy() { return ventasHoy; }
    public void setVentasHoy(int ventasHoy) { this.ventasHoy = ventasHoy; }
    public double getIngresosHoy() { return ingresosHoy; }
    public void setIngresosHoy(double ingresosHoy) { this.ingresosHoy = ingresosHoy; }
    public int getProductosBajos() { return productosBajos; }
    public void setProductosBajos(int productosBajos) { this.productosBajos = productosBajos; }
    public int getProductosVendidos() { return productosVendidos; }
    public void setProductosVendidos(int productosVendidos) { this.productosVendidos = productosVendidos; }
} 