package com.storo.backend.service;

import com.storo.backend.dto.BookingDto;
import com.storo.backend.entity.Booking;
import com.storo.backend.entity.Partner;
import com.storo.backend.entity.User;
import com.storo.backend.exception.BadRequestException;
import com.storo.backend.exception.ResourceNotFoundException;
import com.storo.backend.repository.BookingRepository;
import com.storo.backend.repository.PartnerRepository;
import com.storo.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    PartnerRepository partnerRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailService emailService;

    @Transactional
    public Booking createBooking(String userId, BookingDto.CreateBookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Partner partner = partnerRepository.findById(request.getPartnerId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Partner not found with id: " + request.getPartnerId()));

        if (request.getEndAt().before(request.getStartAt())) {
            throw new BadRequestException("End time must be after start time");
        }

        // Calculate price
        double price = calculatePrice(partner, request.getWeightKg(), request.getStartAt(), request.getEndAt());

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setPartner(partner);
        booking.setWeightKg(request.getWeightKg());
        booking.setStartAt(request.getStartAt());
        booking.setEndAt(request.getEndAt());
        booking.setPrice(price);
        booking.setStatus("pending"); // Default pending, updated by payment or if pay-later
        booking.setPaymentStatus("pending");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        booking = bookingRepository.save(booking);

        return booking;
    }

    private double calculatePrice(Partner partner, Double weightKg, Date startAt, Date endAt) {
        long diffInMillies = Math.abs(endAt.getTime() - startAt.getTime());
        long diff = TimeUnit.HOURS.convert(diffInMillies, TimeUnit.MILLISECONDS);
        double hours = Math.ceil(diffInMillies / (1000.0 * 60 * 60)); // Use float division for ceil

        // Minimum 1 hour charge
        if (hours < 1)
            hours = 1;

        return partner.getBase() + (partner.getPerKg() * weightKg) + (partner.getPerHour() * hours);
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .sorted((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public void deleteBooking(String userId, String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to delete this booking");
        }
        bookingRepository.delete(booking);
    }

    public Booking getBooking(String bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
    }

    public void updateBookingStatus(String bookingId, String status, String paymentStatus) {
        Booking booking = getBooking(bookingId);
        if (status != null)
            booking.setStatus(status);
        if (paymentStatus != null)
            booking.setPaymentStatus(paymentStatus);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        // If booked/paid, send email?
        if ("booked".equals(status) || "paid".equals(paymentStatus)) {
            try {
                // Send email
                Map<String, Object> details = new HashMap<>();
                details.put("bookingId", booking.getId());
                details.put("partnerName", booking.getPartner().getName());
                details.put("partnerCity", booking.getPartner().getAddress()); // simplified
                details.put("startDate", booking.getStartAt());
                details.put("endDate", booking.getEndAt());
                details.put("weightKg", booking.getWeightKg());
                details.put("totalAmount", booking.getPrice());
                details.put("status", booking.getStatus());
                details.put("paymentStatus", booking.getPaymentStatus());

                emailService.sendBookingConfirmation(booking.getUser().getEmail(), booking.getUser().getName(),
                        details);
            } catch (Exception e) {
                // Log email failure but don't fail the request
                System.err.println("Failed to send email: " + e.getMessage());
            }
        }
    }
}
