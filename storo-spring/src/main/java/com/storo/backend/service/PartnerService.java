package com.storo.backend.service;

import com.storo.backend.dto.PartnerDto;
import com.storo.backend.entity.Booking;
import com.storo.backend.entity.Partner;
import com.storo.backend.entity.User;
import com.storo.backend.repository.BookingRepository;
import com.storo.backend.repository.PartnerRepository;
import com.storo.backend.repository.UserRepository;
import com.storo.backend.security.JwtUtils;
import com.storo.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PartnerService {
    @Autowired
    PartnerRepository partnerRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Transactional
    public Map<String, Object> createPartner(PartnerDto.CreatePartnerRequest request) {
        if (userRepository.existsByEmail(request.getUserEmail().toLowerCase())) {
            throw new RuntimeException("User with this email already exists");
        }

        // Create Partner
        Partner partner = new Partner();
        partner.setName(request.getName());
        partner.setAddress(request.getAddress());
        partner.setCapacity(request.getCapacity());
        if (request.getLocation() != null && request.getLocation().getCoordinates() != null) {
            partner.setLocation(new GeoJsonPoint(
                    request.getLocation().getCoordinates().get(0),
                    request.getLocation().getCoordinates().get(1)));
        }
        partner.setBase(request.getBase());
        partner.setPerKg(request.getPerKg());
        partner.setPerHour(request.getPerHour());
        partner.setApproved(false);
        partner.setCreatedAt(LocalDateTime.now());
        partner.setUpdatedAt(LocalDateTime.now());

        partner = partnerRepository.save(partner);

        // Create User
        User user = new User();
        user.setName(request.getUserName());
        user.setEmail(request.getUserEmail().toLowerCase());
        user.setPassword(encoder.encode(request.getUserPassword()));
        user.setRole("partner");
        user.setPartnerId(partner.getId());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        // Generate Token
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String token = jwtUtils.generateTokenFromUser(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Partner request submitted successfully. Awaiting admin approval.");
        response.put("token", token);
        response.put("user", user);
        response.put("partner", partner);

        return response;
    }

    public List<Partner> findNearby(Double lng, Double lat, Double radius) {
        double r = radius != null ? radius : 2000.0;
        return partnerRepository.findByIsApprovedTrueAndLocationNear(
                new Point(lng, lat),
                new Distance(r / 1000, Metrics.KILOMETERS));
    }

    public Partner getPartnerProfile(String partnerId) {
        return partnerRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
    }

    public Map<String, Object> getPartnerStats(String partnerId, Date startDate, Date endDate) {
        List<String> statuses = Arrays.asList("booked", "collected");
        List<Booking> bookings;

        if (startDate != null && endDate != null) {
            bookings = bookingRepository.findByPartnerIdAndStatusInAndCreatedAtBetween(partnerId, statuses, startDate,
                    endDate);
        } else if (startDate != null) {
            bookings = bookingRepository.findByPartnerIdAndStatusInAndCreatedAtGreaterThanEqual(partnerId, statuses,
                    startDate);
        } else {
            bookings = bookingRepository.findByPartnerIdAndStatusIn(partnerId, statuses);
        }

        long totalBookings = bookings.size();
        double totalEarnings = bookings.stream().mapToDouble(b -> b.getPrice() != null ? b.getPrice() : 0).sum();
        long paidBookings = bookings.stream().filter(b -> "paid".equals(b.getPaymentStatus())).count();
        long pendingPayments = bookings.stream().filter(b -> "pending".equals(b.getPaymentStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", totalBookings);
        stats.put("totalEarnings", totalEarnings);
        stats.put("paidBookings", paidBookings);
        stats.put("pendingPayments", pendingPayments);
        stats.put("averageBookingValue", totalBookings > 0 ? totalEarnings / totalBookings : 0);

        return stats;
    }

    public List<Booking> getPartnerBookings(String partnerId, String filter, Date startDate, Date endDate) {
        Date start = startDate;
        Date end = endDate;

        if (filter != null) {
            LocalDateTime now = LocalDateTime.now();
            switch (filter) {
                case "day":
                    start = java.sql.Timestamp.valueOf(now.withHour(0).withMinute(0).withSecond(0).withNano(0));
                    break;
                case "week":
                    start = java.sql.Timestamp.valueOf(now.minusDays(7));
                    break;
                case "month":
                    start = java.sql.Timestamp.valueOf(now.minusDays(30));
                    break;
                case "year":
                    start = java.sql.Timestamp.valueOf(now.minusYears(1));
                    break;
            }
        }

        if (start != null) {
            if (end != null) {
                return bookingRepository.findByPartnerIdAndStatusInAndCreatedAtBetween(partnerId,
                        Arrays.asList("booked", "collected"), start, end);
            } else {
                return bookingRepository.findByPartnerIdAndStatusInAndCreatedAtGreaterThanEqual(partnerId,
                        Arrays.asList("booked", "collected"), start);
            }
        }

        return bookingRepository.findByPartnerIdAndStatusIn(partnerId, Arrays.asList("booked", "collected"));
    }

    // Admin Methods

    public List<Map<String, Object>> getPendingPartners() {
        return getPartnersByApprovalStatus(false);
    }

    public List<Map<String, Object>> getApprovedPartners() {
        return getPartnersByApprovalStatus(true);
    }

    private List<Map<String, Object>> getPartnersByApprovalStatus(boolean isApproved) {
        List<Partner> partners = partnerRepository.findAll().stream()
                .filter(p -> p.isApproved() == isApproved)
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .collect(java.util.stream.Collectors.toList());

        return partners.stream().map(partner -> {
            Map<String, Object> map = new HashMap<>();
            map.put("partner", partner);
            User user = userRepository.findByPartnerId(partner.getId()).orElse(null);
            map.put("user", user);
            return map;
        }).collect(java.util.stream.Collectors.toList());
    }

    public Partner approvePartner(String partnerId) {
        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        partner.setApproved(true);
        return partnerRepository.save(partner);
    }

    @Transactional
    public void rejectPartner(String partnerId) {
        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        partnerRepository.delete(partner);
        userRepository.deleteByPartnerId(partnerId);
    }

    public Map<String, Object> getAdminStats() {
        long totalPartners = partnerRepository.count();
        long approvedPartners = partnerRepository.findAll().stream().filter(Partner::isApproved).count();
        long pendingPartners = totalPartners - approvedPartners;
        long totalUsers = userRepository.findAll().stream().filter(u -> "user".equals(u.getRole())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPartners", totalPartners);
        stats.put("approvedPartners", approvedPartners);
        stats.put("pendingPartners", pendingPartners);
        stats.put("totalUsers", totalUsers);
        return stats;
    }
}
