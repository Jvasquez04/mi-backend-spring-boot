package com.licoreriabillar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.licoreriabillar.model.Venta;
import com.licoreriabillar.service.VentaService;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @PostMapping
    public Venta create(@RequestBody Venta venta) {
        System.out.println("VENTA RECIBIDA: " + venta);
        System.out.println("CONTROLADOR - productosVendidos: " + (venta.getProductosVendidos() != null ? venta.getProductosVendidos().size() : "null"));
        return ventaService.save(venta);
    }

    @GetMapping
    public List<Venta> getAll() {
        return ventaService.getAll();
    }
} 