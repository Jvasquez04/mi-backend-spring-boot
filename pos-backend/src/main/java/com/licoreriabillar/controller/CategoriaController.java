package com.licoreriabillar.controller;

import com.licoreriabillar.dto.CategoriaDTO;
import com.licoreriabillar.model.Categoria;
import com.licoreriabillar.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<CategoriaDTO> getAll() {
        return categoriaService.getAll().stream().map(cat -> {
            CategoriaDTO dto = new CategoriaDTO();
            dto.setId(cat.getId());
            dto.setNombre(cat.getNombre());
            dto.setDescripcion(cat.getDescripcion());
            dto.setActivo(cat.getActivo());
            return dto;
        }).collect(Collectors.toList());
    }


    @PostMapping
    public Categoria create(@RequestBody Categoria categoria) {
        return categoriaService.save(categoria);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> update(@PathVariable Long id, @RequestBody Categoria categoria) {
        return categoriaService.getById(id)
                .map(existing -> {
                    categoria.setId(id);
                    return ResponseEntity.ok(categoriaService.save(categoria));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoriaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}