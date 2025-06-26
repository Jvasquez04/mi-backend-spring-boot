package com.licoreriabillar.controller;

import com.licoreriabillar.dto.RegistroProductoRequest;
import com.licoreriabillar.model.Categoria;
import com.licoreriabillar.model.Producto;
import com.licoreriabillar.repository.CategoriaRepository;
import com.licoreriabillar.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.licoreriabillar.dto.ProductoDTO;
import java.util.stream.Collectors;
import java.math.BigDecimal;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {
    @Autowired
    private ProductoService productoService;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    public List<ProductoDTO> getAll() {
        return productoService.getAll().stream().map(prod -> {
            ProductoDTO dto = new ProductoDTO();
            dto.setId(prod.getId());
            dto.setNombre(prod.getNombre());
            dto.setDescripcion(prod.getDescripcion());
            dto.setPrecioVenta(prod.getPrecioVenta() != null ? prod.getPrecioVenta().doubleValue() : null);
            dto.setStockActual(prod.getStockActual());
            dto.setActivo(prod.getActivo());
            dto.setCategoriaId(prod.getCategoria() != null ? prod.getCategoria().getId() : null);
            dto.setImagen(prod.getImagen());
            return dto;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> create(@RequestBody RegistroProductoRequest request) {
        System.out.println("Precio recibido: " + request.precioVenta);
        System.out.println("Imagen recibida: " + request.imagen);
        Producto producto = new Producto();
        producto.setNombre(request.nombre);
        producto.setDescripcion(request.descripcion);
        if (request.precioVenta != null) {
            producto.setPrecioVenta(request.precioVenta);
        }
        if (request.stockActual != null) {
            producto.setStockActual(request.stockActual);
        }
        producto.setActivo(true);
        producto.setImagen(request.imagen);

        // Buscar la categoría por ID
        Categoria categoria = categoriaRepository.findById(request.categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        producto.setCategoria(categoria);

        productoService.save(producto);

        // Mapear a DTO para evitar ciclos
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecioVenta(producto.getPrecioVenta() != null ? producto.getPrecioVenta().doubleValue() : null);
        dto.setPrecioCompra(producto.getPrecioCompra() != null ? producto.getPrecioCompra().doubleValue() : null);
        dto.setStockActual(producto.getStockActual());
        dto.setActivo(producto.getActivo());
        dto.setCategoriaId(producto.getCategoria() != null ? producto.getCategoria().getId() : null);
        dto.setImagen(producto.getImagen());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> update(@PathVariable Long id, @RequestBody ProductoDTO dto) {
        return productoService.getById(id)
                .map(existing -> {
                    if (dto.getNombre() != null) existing.setNombre(dto.getNombre());
                    if (dto.getDescripcion() != null) existing.setDescripcion(dto.getDescripcion());
                    if (dto.getPrecioVenta() != null) existing.setPrecioVenta(BigDecimal.valueOf(dto.getPrecioVenta()));
                    if (dto.getStockActual() != null) existing.setStockActual(dto.getStockActual());
                    if (dto.getImagen() != null && !dto.getImagen().isEmpty()) existing.setImagen(dto.getImagen());
                    if (dto.getCategoriaId() != null) {
                        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
                        existing.setCategoria(categoria);
                    }
                    if (dto.getActivo() != null) existing.setActivo(dto.getActivo());
                    productoService.save(existing);
                    ProductoDTO updatedDto = new ProductoDTO();
                    updatedDto.setId(existing.getId());
                    updatedDto.setNombre(existing.getNombre());
                    updatedDto.setDescripcion(existing.getDescripcion());
                    updatedDto.setPrecioVenta(existing.getPrecioVenta() != null ? existing.getPrecioVenta().doubleValue() : null);
                    updatedDto.setPrecioCompra(existing.getPrecioCompra() != null ? existing.getPrecioCompra().doubleValue() : null);
                    updatedDto.setStockActual(existing.getStockActual());
                    updatedDto.setActivo(existing.getActivo());
                    updatedDto.setCategoriaId(existing.getCategoria() != null ? existing.getCategoria().getId() : null);
                    updatedDto.setImagen(existing.getImagen());
                    return ResponseEntity.ok(updatedDto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}