package com.uade.tpo.demo.service.User;
import com.uade.tpo.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.demo.controllers.user.UserBlockRequest;
import com.uade.tpo.demo.controllers.user.UserDTO;
import com.uade.tpo.demo.controllers.user.UserUpdateRequest;
import com.uade.tpo.demo.entity.Product;
import com.uade.tpo.demo.entity.Role;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.UserNotExistsException;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<User> getUsers(PageRequest pageRequest) {
        return userRepository.findAll(pageRequest);
    }

    @Override
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public Optional<User> getUserByEmail(String mail) {
        return userRepository.findByEmail(mail);
    }

    @Transactional(rollbackFor = Throwable.class) 
    public User updateUser(Long userId, UserUpdateRequest userUpdateRequest) throws UserNotExistsException{
        Optional<User> users = userRepository.findById(userId);
        if (users.isPresent()){
            User user = users.get();
            if (userUpdateRequest.getEmail() != null && !userUpdateRequest.getEmail().isBlank()) {
                user.setEmail(userUpdateRequest.getEmail());
            }
            if (userUpdateRequest.getFirstname() != null && !userUpdateRequest.getFirstname().isBlank()) {
                user.setFirstName(userUpdateRequest.getFirstname());
            }
            if (userUpdateRequest.getLastname() != null && !userUpdateRequest.getLastname().isBlank()) {
                user.setLastName(userUpdateRequest.getLastname());
            }
            if (userUpdateRequest.getPassword() != null && !userUpdateRequest.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
            }
            userRepository.save(user);
            return user;
        }throw new UserNotExistsException();
    }

    @Transactional(rollbackFor = Throwable.class)
    public User un_blockUser(Long userId, UserBlockRequest userBlockRequest) throws UserNotExistsException{
        Optional<User> users = userRepository.findById(userId);
        if (users.isPresent()) {
            User user = users.get();
            Role rolUsuario = user.getRole();
            if (rolUsuario != Role.BLOQUEADO) {
                user.setRole(Role.BLOQUEADO);
            }else{
                Role rolNuevo = userBlockRequest.getRole();
                user.setRole(rolNuevo);
            }
            userRepository.save(user);
            return user;
        }throw new UserNotExistsException();
    }
    
    public UserDTO cargarUserDTO(User user){
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstname(user.getFirstName());
        dto.setLastname(user.getLastName());
        dto.setRole(user.getRole());
        return dto;
    }
}
