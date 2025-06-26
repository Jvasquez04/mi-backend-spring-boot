package com.licoreriabillar.controller;

import com.licoreriabillar.model.Venta;
import com.licoreriabillar.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {
    @Autowired
    private VentaService ventaService;

    @GetMapping
    public List<Venta> getAll() {
        return ventaService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> getById(@PathVariable Long id) {
        return ventaService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Venta create(@RequestBody Venta venta) {
        return ventaService.save(venta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> update(@PathVariable Long id, @RequestBody Venta venta) {
        return ventaService.getById(id)
                .map(existing -> {
                    venta.setId(id);
                    return ResponseEntity.ok(ventaService.save(venta));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ventaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}