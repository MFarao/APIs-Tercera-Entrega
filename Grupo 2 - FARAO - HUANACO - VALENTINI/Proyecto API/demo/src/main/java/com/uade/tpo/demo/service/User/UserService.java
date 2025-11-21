package com.uade.tpo.demo.service.User;

import java.lang.classfile.ClassFile.Option;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.uade.tpo.demo.controllers.user.UserBlockRequest;
import com.uade.tpo.demo.controllers.user.UserDTO;
import com.uade.tpo.demo.controllers.user.UserUpdateRequest;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.UserNotExistsException;

public interface UserService {
    public Page<User> getUsers(PageRequest pageRequest);

    public Optional<User> getUserById(Long userId);

    public Optional<User> getUserByEmail(String mail);

    public User updateUser(Long userId,@RequestBody UserUpdateRequest userUpdateRequest) throws UserNotExistsException;

    public User un_blockUser(Long userId,@RequestBody UserBlockRequest userBlockRequest) throws UserNotExistsException;
    
    public UserDTO cargarUserDTO(User user);
}
