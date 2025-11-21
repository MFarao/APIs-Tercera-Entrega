package com.uade.tpo.demo.controllers.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import com.uade.tpo.demo.entity.Role;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors() // 👈 habilita CORS
                                .and()
                                .csrf(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests(req -> req
                                .requestMatchers(HttpMethod.POST, "/categories").hasAuthority(Role.ADMIN.name())// SOLO LOS ADMINS CREARAN LAS CATEGORIAS
                                .requestMatchers(HttpMethod.DELETE, "/categories/**").hasAuthority(Role.ADMIN.name())// SOLO LOS ADMINS ELIMINARAN LAS CATEGORIAS
                                .requestMatchers(HttpMethod.PUT, "/categories/**").hasAuthority(Role.ADMIN.name())// SOLO LOS ADMINS MODIFCARAN LAS CATEGORIAS
 
                                .requestMatchers(HttpMethod.GET,"/discounts", "/discounts/**").hasAuthority(Role.ADMIN.name())// SOLO LOS ADMINS PODRAN VER LOS DESCUENTOS
                                .requestMatchers(HttpMethod.POST,"/discounts").hasAuthority(Role.ADMIN.name())// SOLO LOS ADMINS PODRAN CREAR DESCUENTOS
                                .requestMatchers(HttpMethod.PUT,"/discounts/**").hasAuthority(Role.ADMIN.name())// SOLO LOS ADMINS PODRAN MODIFICAR DESCUENTOS
                                
                                .requestMatchers(HttpMethod.POST, "/products").hasAuthority(Role.ADMIN.name()) // SOLO LOS ADMINS CREAN PRODUCTOS
                                .requestMatchers(HttpMethod.PUT,"/products/**").hasAuthority(Role.ADMIN.name()) // SOLO LOS ADMIN PUEDEN MODIFICAR LOS PRODUCTOS
                               
                                .requestMatchers(HttpMethod.GET, "/users/me").authenticated() // CUALQUIER USUARIO LOGUEADO PUEDE VER SU PROPIO PERFIL     
                                .requestMatchers(HttpMethod.GET, "/users/**").hasAuthority(Role.ADMIN.name()) //SOLO LOS ADMINS MANEJAN USUARIOS
                                .requestMatchers(HttpMethod.PUT, "/users/**").hasAnyAuthority(Role.USER.name(),Role.ADMIN.name()) //los admins y usarios podran cambiar sus datos
       
                                .requestMatchers(HttpMethod.GET, "/order").hasAuthority(Role.ADMIN.name()) // TODAS LAS ORDENES SOLO LAS PUEDEN VER LOS ADMINS
                                .requestMatchers(HttpMethod.GET, "/order/**").hasAnyAuthority(Role.USER.name(),Role.ADMIN.name()) // LAS ORDENES LOS PUEDEN VER TODOS
                                .requestMatchers(HttpMethod.POST, "/order").hasAnyAuthority(Role.USER.name(),Role.ADMIN.name()) // LAS ORDENES LOS PUEDEN VER TODOS
                                .requestMatchers(HttpMethod.PUT, "/order/**").hasAuthority(Role.ADMIN.name()) // LAS ORDENES PUEDEN SER PASADAS DE ESTADO UNICAMENTE POR ADMIN

                                .requestMatchers(HttpMethod.GET, "/categories", "/categories/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/products", "/products/**").permitAll()
                                .requestMatchers("/api/v1/auth/**").permitAll()           
                                                .anyRequest()
                                                .authenticated())
                                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }   
        
}
