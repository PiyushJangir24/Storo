package com.storo.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Date;

public class BookingDto {
    @Data
    public static class CreateBookingRequest {
        @NotBlank(message = "Partner ID is required")
        private String partnerId;

        @NotNull(message = "Weight is required")
        @Min(value = 1, message = "Weight must be at least 1kg")
        private Double weightKg;

        @NotNull(message = "Start time is required")
        @Future(message = "Start time must be in the future")
        private Date startAt;

        @NotNull(message = "End time is required")
        @Future(message = "End time must be in the future")
        private Date endAt;

        @NotBlank(message = "Payment method is required")
        private String paymentMethod; // 'pay-now' or 'pay-later'
    }
}
