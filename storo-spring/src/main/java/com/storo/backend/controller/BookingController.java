package com.storo.backend.controller;

import com.storo.backend.dto.BookingDto;
import com.storo.backend.security.UserDetailsImpl;
import com.storo.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody BookingDto.CreateBookingRequest request) {
        return new ResponseEntity<>(bookingService.createBooking(userDetails.getId(), request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<?> getUserBookings(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(bookingService.getUserBookings(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingDetails(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBooking(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id, @RequestBody StatusUpdateRequest request) {
        bookingService.updateBookingStatus(id, request.getStatus(), null);
        return ResponseEntity.ok(bookingService.getBooking(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String id) {
        bookingService.deleteBooking(userDetails.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Booking deleted successfully"));
    }

    static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    static class StatusUpdateRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
