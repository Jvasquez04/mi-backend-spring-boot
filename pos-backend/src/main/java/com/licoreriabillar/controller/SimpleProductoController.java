package com.licoreriabillar.controller;

import com.licoreriabillar.model.Producto;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/productos")
@Profile("docker")
@CrossOrigin(origins = "*")
public class SimpleProductoController {

    private final Map<Long, Producto> productos = new ConcurrentHashMap<>();
    private long nextId = 1;

    public SimpleProductoController() {
        // Datos de ejemplo
        Producto p1 = new Producto();
        p1.setId(nextId++);
        p1.setNombre("Cerveza Pilsen");
        p1.setDescripcion("Cerveza nacional 350ml");
        p1.setPrecio(new BigDecimal("3.50"));
        p1.setStock(50);
        p1.setCategoriaId(1L);
        p1.setActivo(true);
        productos.put(p1.getId(), p1);

        Producto p2 = new Producto();
        p2.setId(nextId++);
        p2.setNombre("Whisky Jack Daniels");
        p2.setDescripcion("Whisky premium 750ml");
        p2.setPrecio(new BigDecimal("45.00"));
        p2.setStock(20);
        p2.setCategoriaId(2L);
        p2.setActivo(true);
        productos.put(p2.getId(), p2);

        Producto p3 = new Producto();
        p3.setId(nextId++);
        p3.setNombre("Vino Tinto");
        p3.setDescripcion("Vino tinto reserva 750ml");
        p3.setPrecio(new BigDecimal("25.00"));
        p3.setStock(30);
        p3.setCategoriaId(3L);
        p3.setActivo(true);
        productos.put(p3.getId(), p3);
    }

    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        return ResponseEntity.ok(new ArrayList<>(productos.values()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Producto producto = productos.get(id);
        if (producto != null) {
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody Producto producto) {
        producto.setId(nextId++);
        producto.setActivo(true);
        productos.put(producto.getId(), producto);
        return ResponseEntity.ok(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
        if (productos.containsKey(id)) {
            producto.setId(id);
            productos.put(id, producto);
            return ResponseEntity.ok(producto);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        if (productos.remove(id) != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 