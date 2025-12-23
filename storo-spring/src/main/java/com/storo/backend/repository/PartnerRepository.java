package com.storo.backend.repository;

import com.storo.backend.entity.Partner;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PartnerRepository extends MongoRepository<Partner, String> {
    // Geospatial query to find nearby approved partners
    List<Partner> findByIsApprovedTrueAndLocationNear(Point location, Distance distance);
}
