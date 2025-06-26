package com.licoreriabillar.service;

import com.licoreriabillar.model.Venta;
import com.licoreriabillar.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VentaService {
    @Autowired
    private VentaRepository ventaRepository;

    public List<Venta> getAll() {
        return ventaRepository.findAll();
    }

    public Optional<Venta> getById(Long id) {
        return ventaRepository.findById(id);
    }

    public Venta save(Venta venta) {
        return ventaRepository.save(venta);
    }

    public void delete(Long id) {
        ventaRepository.deleteById(id);
    }
}