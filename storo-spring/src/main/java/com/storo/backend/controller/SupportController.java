package com.storo.backend.controller;

import com.storo.backend.repository.TicketRepository;
import com.storo.backend.security.UserDetailsImpl;
import com.storo.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
public class SupportController {
    @Autowired
    TicketService ticketService;

    @Autowired
    TicketRepository ticketRepository;

    @PostMapping
    public ResponseEntity<?> createTicket(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody CreateTicketRequest request) {
        try {
            return ResponseEntity
                    .ok(ticketService.createTicket(userDetails.getId(), request.getSubject(), request.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserTickets(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(ticketRepository.findByUserId(userDetails.getId()));
    }

    static class CreateTicketRequest {
        private String subject;
        private String message;

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
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
}
