package com.factory.safety.service;

import com.factory.safety.config.JwtUtils;
import com.factory.safety.dto.AuthRequest;
import com.factory.safety.dto.AuthResponse;
import com.factory.safety.model.User;
import com.factory.safety.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Value("${app.default-admin.username}")
    private String defaultAdminUsername;

    @Value("${app.default-admin.password}")
    private String defaultAdminPassword;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostConstruct
    public void seedDefaultAdmin() {
        if (!userRepository.existsByUsername(defaultAdminUsername)) {
            User admin = new User();
            admin.setUsername(defaultAdminUsername);
            admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            log.info("Default admin user created: {}", defaultAdminUsername);
        }
    }

    public AuthResponse authenticate(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole());
    }
}
