package com.storo.backend.service;

import com.storo.backend.dto.AuthDto;
import com.storo.backend.entity.User;
import com.storo.backend.repository.UserRepository;
import com.storo.backend.security.JwtUtils;
import com.storo.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Date;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailService emailService;

    public AuthDto.JwtResponse login(AuthDto.LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail().toLowerCase(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        AuthDto.UserResponse userResponse = new AuthDto.UserResponse();
        userResponse.setId(userDetails.getId());
        userResponse.setName(userDetails.getUsername()); // Username in UserDetailsImpl is actually email, wait.
        // UserDetailsImpl: username=email, email=email.
        // I need the actual name. UserDetailsImpl doesn't have 'name' field, only
        // username/email.
        // I should update UserDetailsImpl to have 'name'.
        // Or fetch user again.
        // Let's update UserDetailsImpl to store name.

        // For now, I'll fetch user or just use email if name is not available.
        // But I should fix UserDetailsImpl.
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        userResponse.setName(user.getName());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole());
        userResponse.setPartnerId(user.getPartnerId());

        return new AuthDto.JwtResponse(jwt, userResponse);
    }

    public AuthDto.JwtResponse register(AuthDto.RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail().toLowerCase())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail().toLowerCase());
        user.setPassword(encoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : "user");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        // Auto login after register? Node code returns token.
        // So yes, generate token.
        // We can manually generate token without authenticationManager if we want,
        // or just use the user object.
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String jwt = jwtUtils.generateTokenFromUser(userDetails);

        AuthDto.UserResponse userResponse = new AuthDto.UserResponse();
        userResponse.setId(user.getId());
        userResponse.setName(user.getName());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole());

        return new AuthDto.JwtResponse(jwt, userResponse);
    }

    public User getUserProfile(String userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String userId, AuthDto.UpdateProfileRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null)
            user.setName(request.getName());
        if (request.getPhone() != null)
            user.setPhone(request.getPhone());
        if (request.getAddress() != null)
            user.setAddress(request.getAddress());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return; // Don't reveal existence
        }

        // Generate token
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        String resetToken = sb.toString();

        // Hash token
        String hashedToken = hashToken(resetToken);

        user.setResetToken(hashedToken);
        user.setResetTokenExpiry(new Date(System.currentTimeMillis() + 3600000)); // 1 hour
        userRepository.save(user);

        String resetUrl = "http://localhost:3000/reset-password/" + resetToken;
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetUrl);
    }

    public void resetPassword(String token, String newPassword) {
        String hashedToken = hashToken(token);

        User user = userRepository.findByResetTokenAndResetTokenExpiryGreaterThan(hashedToken, new Date())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        user.setPassword(encoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
            for (int i = 0; i < encodedhash.length; i++) {
                String hex = Integer.toHexString(0xff & encodedhash[i]);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
