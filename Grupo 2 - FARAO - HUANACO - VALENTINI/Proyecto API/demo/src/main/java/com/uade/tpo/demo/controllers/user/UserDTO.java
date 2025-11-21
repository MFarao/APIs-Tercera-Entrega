package com.uade.tpo.demo.controllers.user;

import com.uade.tpo.demo.entity.Role;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String firstname;
    private String lastname;
    private Role role;
}