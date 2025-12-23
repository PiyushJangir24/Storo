package com.storo.backend.controller;

import com.storo.backend.service.PartnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    PartnerService partnerService;

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        return ResponseEntity.ok(partnerService.getAdminStats());
    }

    @GetMapping("/partners/pending")
    public ResponseEntity<?> getPendingPartners() {
        return ResponseEntity.ok(partnerService.getPendingPartners());
    }

    @GetMapping("/partners/approved")
    public ResponseEntity<?> getApprovedPartners() {
        return ResponseEntity.ok(partnerService.getApprovedPartners());
    }

    @PutMapping("/partners/{partnerId}/approve")
    public ResponseEntity<?> approvePartner(@PathVariable String partnerId) {
        try {
            return ResponseEntity.ok(partnerService.approvePartner(partnerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/partners/{partnerId}/reject")
    public ResponseEntity<?> rejectPartner(@PathVariable String partnerId) {
        try {
            partnerService.rejectPartner(partnerId);
            return ResponseEntity.ok(new MessageResponse("Partner request rejected and deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
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
