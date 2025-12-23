package com.storo.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    @JsonProperty("_id")
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String phone;

    private String address;

    private String role; // 'user', 'partner', 'admin'

    // In MongoDB, we can store the ID directly or use DBRef.
    // The original code stores partnerId as ObjectId.
    private String partnerId;

    private String resetToken;

    private Date resetTokenExpiry;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
