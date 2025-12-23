package com.storo.backend.dto;

import lombok.Data;

public class AuthDto {
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String role; // optional
    }

    @Data
    public static class JwtResponse {
        private String token;
        private UserResponse user;

        public JwtResponse(String token, UserResponse user) {
            this.token = token;
            this.user = user;
        }
    }

    @Data
    public static class UserResponse {
        private String id;
        private String name;
        private String email;
        private String role;
        private String partnerId;

        // For profile update
        private String phone;
        private String address;
    }

    @Data
    public static class UpdateProfileRequest {
        private String name;
        private String phone;
        private String address;
    }

    @Data
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
    }
}
