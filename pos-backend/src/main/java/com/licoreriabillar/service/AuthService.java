package com.licoreriabillar.service;

import com.licoreriabillar.enums.Rol;
import com.licoreriabillar.model.Usuario;
import com.licoreriabillar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<Usuario> authenticateUser(String username, String password) {
        return usuarioRepository.findByNombreUsuario(username)
                .filter(usuario -> passwordEncoder.matches(password, usuario.getPasswordHash()));
    }

    public boolean registerUser(String username, String password, String fullName, Rol rol) {
        if (usuarioRepository.existsByNombreUsuario(username)) {
            return false;
        }

        Usuario newUser = new Usuario();
        newUser.setNombreUsuario(username);
        newUser.setPasswordHash(passwordEncoder.encode(password));
        newUser.setNombreCompleto(fullName);
        newUser.setRol(rol);
        newUser.setActivo(true);

        usuarioRepository.save(newUser);
        return true;
    }
}