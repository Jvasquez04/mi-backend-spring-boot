package com.licoreriabillar.controller;

import com.licoreriabillar.model.Categoria;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/categorias")
@Profile("docker")
@CrossOrigin(origins = "*")
public class SimpleCategoriaController {

    private final Map<Long, Categoria> categorias = new ConcurrentHashMap<>();
    private long nextId = 1;

    public SimpleCategoriaController() {
        // Datos de ejemplo
        Categoria c1 = new Categoria();
        c1.setId(nextId++);
        c1.setNombre("Cervezas");
        c1.setDescripcion("Variedad de cervezas nacionales e importadas");
        c1.setActivo(true);
        categorias.put(c1.getId(), c1);

        Categoria c2 = new Categoria();
        c2.setId(nextId++);
        c2.setNombre("Licores");
        c2.setDescripcion("Licores premium y de alta calidad");
        c2.setActivo(true);
        categorias.put(c2.getId(), c2);

        Categoria c3 = new Categoria();
        c3.setId(nextId++);
        c3.setNombre("Vinos");
        c3.setDescripcion("Vinos tintos, blancos y rosados");
        c3.setActivo(true);
        categorias.put(c3.getId(), c3);

        Categoria c4 = new Categoria();
        c4.setId(nextId++);
        c4.setNombre("Snacks");
        c4.setDescripcion("Aperitivos y botanas");
        c4.setActivo(true);
        categorias.put(c4.getId(), c4);

        Categoria c5 = new Categoria();
        c5.setId(nextId++);
        c5.setNombre("Servicios");
        c5.setDescripcion("Servicios de billar y otros");
        c5.setActivo(true);
        categorias.put(c5.getId(), c5);
    }

    @GetMapping
    public ResponseEntity<List<Categoria>> getAllCategorias() {
        return ResponseEntity.ok(new ArrayList<>(categorias.values()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Long id) {
        Categoria categoria = categorias.get(id);
        if (categoria != null) {
            return ResponseEntity.ok(categoria);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@RequestBody Categoria categoria) {
        categoria.setId(nextId++);
        categoria.setActivo(true);
        categorias.put(categoria.getId(), categoria);
        return ResponseEntity.ok(categoria);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> updateCategoria(@PathVariable Long id, @RequestBody Categoria categoria) {
        if (categorias.containsKey(id)) {
            categoria.setId(id);
            categorias.put(id, categoria);
            return ResponseEntity.ok(categoria);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable Long id) {
        if (categorias.remove(id) != null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 