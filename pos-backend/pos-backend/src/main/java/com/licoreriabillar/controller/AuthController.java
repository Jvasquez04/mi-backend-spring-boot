package com.licoreriabillar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import com.licoreriabillar.model.Usuario;
import com.licoreriabillar.security.CustomUserDetails;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.nombreUsuario, request.password)
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.nombreUsuario);
            String token = jwtService.generateToken(userDetails);

            // Obtener el usuario real desde CustomUserDetails
            Usuario usuario = null;
            if (userDetails instanceof CustomUserDetails) {
                usuario = ((CustomUserDetails) userDetails).getUsuario();
            }
            // Crear un DTO simple para exponer solo los campos necesarios
            Map<String, Object> userMap = Map.of(
                "nombreUsuario", usuario.getNombreUsuario(),
                "nombreCompleto", usuario.getNombreCompleto(),
                "rol", usuario.getRol().name()
            );
            return ResponseEntity.ok().body(Map.of(
                "token", token,
                "user", userMap
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
        }
    }
} 