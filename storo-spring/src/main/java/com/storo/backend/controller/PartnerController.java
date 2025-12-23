package com.storo.backend.controller;

import com.storo.backend.dto.PartnerDto;
import com.storo.backend.security.UserDetailsImpl;
import com.storo.backend.service.PartnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/partners")
public class PartnerController {
    @Autowired
    PartnerService partnerService;

    @PostMapping
    public ResponseEntity<?> createPartner(@RequestBody PartnerDto.CreatePartnerRequest request) {
        try {
            return ResponseEntity.ok(partnerService.createPartner(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/nearby")
    public ResponseEntity<?> findNearby(@RequestBody PartnerDto.NearbyRequest request) {
        return ResponseEntity.ok(partnerService.findNearby(request.getLng(), request.getLat(), request.getRadius()));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<?> getPartnerStats(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        if (userDetails.getPartnerId() == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("User is not associated with a partner"));
        }
        return ResponseEntity.ok(partnerService.getPartnerStats(userDetails.getPartnerId(), startDate, endDate));
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<?> getPartnerBookings(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        if (userDetails.getPartnerId() == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("User is not associated with a partner"));
        }
        return ResponseEntity
                .ok(partnerService.getPartnerBookings(userDetails.getPartnerId(), filter, startDate, endDate));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('PARTNER')")
    public ResponseEntity<?> getPartnerProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails.getPartnerId() == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("User is not associated with a partner"));
        }
        return ResponseEntity.ok(partnerService.getPartnerProfile(userDetails.getPartnerId()));
    }

    static class MessageResponse {
        private String error;

        public MessageResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }
    }
}
