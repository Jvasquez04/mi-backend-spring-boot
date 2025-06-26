package com.licoreriabillar.service;

import com.licoreriabillar.model.Usuario;
import com.licoreriabillar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNombreUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        return User.builder()
                .username(usuario.getNombreUsuario())
                .password(usuario.getPasswordHash())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())))
                .build();
    }
}