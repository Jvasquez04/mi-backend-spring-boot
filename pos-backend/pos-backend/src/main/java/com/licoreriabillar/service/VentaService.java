package com.licoreriabillar.service;

import com.licoreriabillar.model.Venta;
import com.licoreriabillar.model.Producto;
import com.licoreriabillar.model.VentaProducto;
import com.licoreriabillar.repository.VentaRepository;
import com.licoreriabillar.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class VentaService {
    @Autowired
    private VentaRepository ventaRepository;
    @Autowired
    private ProductoRepository productoRepository;

    public List<Venta> getAll() {
        return ventaRepository.findAll();
    }

    @Transactional
    public Venta save(Venta venta) {
        System.out.println("Productos recibidos en la venta: " + (venta.getProductosVendidos() != null ? venta.getProductosVendidos().size() : "null"));
        if (venta.getProductosVendidos() != null) {
            for (VentaProducto vp : venta.getProductosVendidos()) {
                Producto producto = productoRepository.findById(vp.getProducto() != null ? vp.getProducto().getId() : null).orElse(null);
                System.out.println("ID producto recibido: " + (vp.getProducto() != null ? vp.getProducto().getId() : "null"));
                System.out.println("Producto encontrado: " + (producto != null ? producto.getNombre() : "NO ENCONTRADO"));
                System.out.println("Precio venta: " + (producto != null ? producto.getPrecioVenta() : "N/A"));
                if (producto != null && producto.getStockActual() != null) {
                    int cantidadVendida = vp.getCantidad() != null ? vp.getCantidad() : 1;
                    int nuevoStock = (producto.getStockActual() != null ? producto.getStockActual() : 0) - cantidadVendida;
                    producto.setStockActual(Math.max(nuevoStock, 0));
                    productoRepository.save(producto);
                    vp.setProducto(producto);
                    vp.setVenta(venta);
                    vp.setPrecioUnitario(producto.getPrecioVenta());
                    if (producto.getPrecioVenta() != null) {
                        vp.setSubtotal(producto.getPrecioVenta().multiply(new java.math.BigDecimal(cantidadVendida)));
                    } else {
                        vp.setSubtotal(java.math.BigDecimal.ZERO);
                    }
                }
            }
        }
        return ventaRepository.save(venta);
    }
} 