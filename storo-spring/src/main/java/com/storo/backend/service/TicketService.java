package com.storo.backend.service;

import com.storo.backend.entity.Ticket;
import com.storo.backend.entity.User;
import com.storo.backend.repository.TicketRepository;
import com.storo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class TicketService {
    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailService emailService;

    public Ticket createTicket(String userId, String subject, String message) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setSubject(subject);
        ticket.setMessage(message);
        ticket.setStatus("open");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        ticket = ticketRepository.save(ticket);

        // Send email
        Map<String, Object> details = new HashMap<>();
        details.put("ticketId", ticket.getId());
        details.put("subject", ticket.getSubject());
        details.put("message", ticket.getMessage());
        details.put("status", ticket.getStatus());

        emailService.sendSupportTicketConfirmation(user.getEmail(), user.getName(), details);

        return ticket;
    }
}
