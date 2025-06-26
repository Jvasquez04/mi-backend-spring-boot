package com.licoreriabillar.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.licoreriabillar.repository.UsuarioRepository;
import com.licoreriabillar.model.Usuario;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Busca el usuario en la base de datos
        Usuario usuario = usuarioRepository.findByNombreUsuario(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Asigna el rol real del usuario
        String rolSpring = "ROLE_" + usuario.getRol().name(); // Ej: ROLE_ADMINISTRADOR

        return User.builder()
                .username(usuario.getNombreUsuario())
                .password(usuario.getPasswordHash()) // Usa el hash real de la base de datos
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(rolSpring)))
                .build();
    }
} 