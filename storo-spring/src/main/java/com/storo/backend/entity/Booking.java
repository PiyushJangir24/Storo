package com.storo.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    @JsonProperty("_id")
    private String id;

    @DBRef
    private User user;

    @DBRef
    private Partner partner;

    private Double weightKg;

    private Date startAt;
    private Date endAt;

    private Double price;

    private String status; // 'pending', 'booked', 'collected'
    private String paymentStatus; // 'pending', 'paid'

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
