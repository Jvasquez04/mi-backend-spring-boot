package com.licoreriabillar.controller;

import com.licoreriabillar.dto.DashboardStats;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@Profile("docker")
@CrossOrigin(origins = "*")
public class SimpleDashboardController {

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalVentas(1250);
        stats.setTotalProductos(15);
        stats.setTotalCategorias(5);
        stats.setVentasHoy(45);
        stats.setIngresosHoy(new BigDecimal("1250.50"));
        stats.setIngresosMes(new BigDecimal("15250.75"));
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/ventas-recientes")
    public ResponseEntity<Map<String, Object>> getVentasRecientes() {
        Map<String, Object> response = new HashMap<>();
        response.put("ventas", new Object[]{
            Map.of("id", 1, "fecha", "2024-01-15", "total", 45.50, "metodoPago", "Efectivo"),
            Map.of("id", 2, "fecha", "2024-01-15", "total", 32.00, "metodoPago", "Tarjeta"),
            Map.of("id", 3, "fecha", "2024-01-15", "total", 78.25, "metodoPago", "Efectivo")
        });
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/productos-populares")
    public ResponseEntity<Map<String, Object>> getProductosPopulares() {
        Map<String, Object> response = new HashMap<>();
        response.put("productos", new Object[]{
            Map.of("nombre", "Cerveza Pilsen", "ventas", 25, "ingresos", 87.50),
            Map.of("nombre", "Whisky Jack Daniels", "ventas", 8, "ingresos", 360.00),
            Map.of("nombre", "Vino Tinto", "ventas", 12, "ingresos", 300.00)
        });
        
        return ResponseEntity.ok(response);
    }
} 