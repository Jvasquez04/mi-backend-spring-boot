package com.licoreriabillar.controller;

import com.licoreriabillar.dto.LoginRequest;
import com.licoreriabillar.dto.UserDTO;
import com.licoreriabillar.model.Usuario;
import com.licoreriabillar.repository.UsuarioRepository;
import com.licoreriabillar.security.JwtService;
import com.licoreriabillar.service.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.nombreUsuario, request.password)
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.nombreUsuario);
            String token = jwtService.generateToken(userDetails);

            // Buscar el usuario en la base de datos
            Usuario usuario = usuarioRepository.findByNombreUsuario(request.nombreUsuario).orElse(null);

            if (usuario == null) {
                return ResponseEntity.status(401).body("{\"error\": \"Usuario no encontrado\"}");
            }

            // Construir el UserDTO
            UserDTO userDTO = UserDTO.builder()
                .nombreUsuario(usuario.getNombreUsuario())
                .nombreCompleto(usuario.getNombreCompleto())
                .rol(usuario.getRol().name())
                .build();

            // Construir la respuesta con el objeto user anidado
            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .user(userDTO)
                    .build();

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("{\"error\": \"Credenciales inválidas\"}");
        }
    }
}