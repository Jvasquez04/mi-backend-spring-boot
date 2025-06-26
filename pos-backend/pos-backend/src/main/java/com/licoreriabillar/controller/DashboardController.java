package com.licoreriabillar.controller;

import com.licoreriabillar.dto.DashboardStats;
import com.licoreriabillar.service.ProductoService;
import com.licoreriabillar.service.VentaService;
import com.licoreriabillar.model.Producto;
import com.licoreriabillar.model.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private ProductoService productoService;
    @Autowired
    private VentaService ventaService;

    @GetMapping("/stats")
    public DashboardStats getStats() {
        List<Producto> productos = productoService.getAll();
        List<Venta> ventas = ventaService.getAll();
        int productosActivos = (int) productos.stream().filter(p -> Boolean.TRUE.equals(p.getActivo()) && p.getStockActual() != null && p.getStockActual() > 0).count();
        ZoneId zonaLocal = ZoneId.of("America/Lima");
        LocalDate hoy = LocalDate.now(zonaLocal);
        List<Venta> ventasHoy = ventas.stream()
            .filter(v -> v.getFecha() != null && v.getFecha().atZone(ZoneId.systemDefault()).withZoneSameInstant(zonaLocal).toLocalDate().equals(hoy))
            .toList();
        double ingresosHoy = ventasHoy.stream().mapToDouble(Venta::getTotal).sum();
        int productosBajos = (int) productos.stream().filter(p -> Boolean.TRUE.equals(p.getActivo()) && p.getStockActual() != null && p.getStockActual() < 5).count();
        int productosVendidosHoy = ventasHoy.stream()
            .flatMap(v -> v.getProductosVendidos() != null ? v.getProductosVendidos().stream() : java.util.stream.Stream.empty())
            .mapToInt(vp -> vp.getCantidad() != null ? vp.getCantidad() : 0)
            .sum();
        DashboardStats stats = new DashboardStats(productosActivos, ventasHoy.size(), ingresosHoy, productosBajos);
        stats.setProductosVendidos(productosVendidosHoy);
        return stats;
    }
} 