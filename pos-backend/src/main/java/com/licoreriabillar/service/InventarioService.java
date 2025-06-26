package com.licoreriabillar.service;

import com.licoreriabillar.model.Producto;
import com.licoreriabillar.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventarioService {

    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<Producto> listarProductos() {
        return productoRepository.findByActivoTrue();
    }

    @Transactional(readOnly = true)
    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productoRepository.findById(id);
    }

    @Transactional
    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Transactional
    public Optional<Producto> actualizarProducto(Long id, Producto productoActualizado) {
        return productoRepository.findById(id)
                .map(productoExistente -> {
                    productoExistente.setNombre(productoActualizado.getNombre());
                    productoExistente.setDescripcion(productoActualizado.getDescripcion());
                    productoExistente.setPrecioVenta(productoActualizado.getPrecioVenta());
                    productoExistente.setPrecioCompra(productoActualizado.getPrecioCompra());
                    productoExistente.setStockActual(productoActualizado.getStockActual());
                    productoExistente.setUnidadMedida(productoActualizado.getUnidadMedida());
                    productoExistente.setVolumenMl(productoActualizado.getVolumenMl());
                    productoExistente.setCodigoBarras(productoActualizado.getCodigoBarras());
                    productoExistente.setUltimaActualizacion(LocalDateTime.now());
                    return productoRepository.save(productoExistente);
                });
    }

    @Transactional
    public void eliminarProducto(Long id) {
        productoRepository.findById(id).ifPresent(producto -> {
            producto.setActivo(false);
            productoRepository.save(producto);
        });
    }

    @Transactional(readOnly = true)
    public List<Producto> buscarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaIdAndActivoTrue(categoriaId);
    }

    @Transactional(readOnly = true)
    public Optional<Producto> buscarPorCodigoBarras(String codigoBarras) {
        return productoRepository.findByCodigoBarras(codigoBarras);
    }

    @Transactional(readOnly = true)
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Transactional
    public boolean actualizarStock(Long id, int cantidad) {
        return productoRepository.findById(id)
                .map(producto -> {
                    double nuevoStock = producto.getStockActual() + cantidad;
                    if (nuevoStock >= 0) {
                        producto.setStockActual(nuevoStock);
                        producto.setUltimaActualizacion(LocalDateTime.now());
                        productoRepository.save(producto);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }
}