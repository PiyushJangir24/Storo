package com.storo.backend.dto;

import lombok.Data;
import java.util.List;

public class PartnerDto {
    @Data
    public static class CreatePartnerRequest {
        // Partner details
        private String name;
        private String address;
        private Integer capacity;
        private LocationDto location;
        private Double base;
        private Double perKg;
        private Double perHour;

        // User details
        private String userName;
        private String userEmail;
        private String userPassword;
    }

    @Data
    public static class LocationDto {
        private String type = "Point";
        private List<Double> coordinates; // [lng, lat]
    }

    @Data
    public static class NearbyRequest {
        private Double lng;
        private Double lat;
        private Double radius;
    }
}
