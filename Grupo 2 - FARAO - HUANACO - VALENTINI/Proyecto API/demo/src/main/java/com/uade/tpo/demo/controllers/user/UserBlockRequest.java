package com.uade.tpo.demo.controllers.user;

import com.uade.tpo.demo.entity.Role;

import lombok.Data;

@Data
public class UserBlockRequest {
    private Long idUser;
    private String email;
    private Role role;
}
