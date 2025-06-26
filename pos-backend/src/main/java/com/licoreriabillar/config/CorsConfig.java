package com.licoreriabillar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.addAllowedOriginPattern("*"); // Permite cualquier origen
        config.addAllowedMethod("*");        // Permite cualquier método
        config.addAllowedHeader("*");        // Permite cualquier header
        config.setAllowCredentials(false);   // Para pruebas, mejor en false

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}