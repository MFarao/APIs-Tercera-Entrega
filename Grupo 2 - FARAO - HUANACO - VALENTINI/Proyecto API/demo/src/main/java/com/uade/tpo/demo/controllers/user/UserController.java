package com.uade.tpo.demo.controllers.user;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.controllers.product.ProductUpdateRequest;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.ProductNotExistsException;
import com.uade.tpo.demo.exceptions.UserNotExistsException;
import com.uade.tpo.demo.service.User.UserService;

@RestController
@RequestMapping("users")
public class UserController {

    @Autowired 
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers(
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size) {

        int p = (page == null) ? 0 : page;
        int s = (size == null) ? Integer.MAX_VALUE : size;

        List<UserDTO> dtoList = new ArrayList<>();
        for (User u : userService.getUsers(PageRequest.of(p, s))) {
            UserDTO dto = userService.cargarUserDTO(u);
            dtoList.add(dto);
        }

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> result = userService.getUserByEmail(email);
        if (result.isPresent()){
            User user = result.get();
            UserDTO dto = userService.cargarUserDTO(user);
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
        Optional<User> result = userService.getUserById(userId);
        if (result.isPresent()){
            User user = result.get();
            UserDTO dto = userService.cargarUserDTO(user);
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long userId,@RequestBody UserUpdateRequest userUpdateRequest) throws UserNotExistsException {
        User updated = userService.updateUser(userId, userUpdateRequest);
        UserDTO dto = userService.cargarUserDTO(updated);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{userId}/un_block") // block solo cambia el rol a Bloqueado o lo devuelve a su estado
    public ResponseEntity<UserDTO> un_blockUser(@PathVariable Long userId,@RequestBody UserBlockRequest userBlockRequest) throws UserNotExistsException {
        User updated = userService.un_blockUser(userId, userBlockRequest);
        UserDTO dto = userService.cargarUserDTO(updated);
        return ResponseEntity.ok(dto);
    }
}
