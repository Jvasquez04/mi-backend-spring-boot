package com.licoreriabillar.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "categorias")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    private List<Producto> productos = new ArrayList<>();

    @Column(nullable = false)
    private Boolean activo = true;
}