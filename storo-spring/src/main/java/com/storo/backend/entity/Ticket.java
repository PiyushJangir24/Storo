package com.storo.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    @JsonProperty("_id")
    private String id;

    @DBRef
    private User user; // mapped to userId in original, but DBRef is cleaner if we want to populate

    private String subject;
    private String message;
    private String status; // 'open', 'in-progress', 'resolved'

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
