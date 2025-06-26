package com.licoreriabillar.repository;

import com.licoreriabillar.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByActivoTrue();
    List<Producto> findByCategoriaIdAndActivoTrue(Long categoriaId);
    Optional<Producto> findByCodigoBarras(String codigoBarras);
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}