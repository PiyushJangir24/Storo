package com.storo.backend.repository;

import com.storo.backend.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;
import java.util.Date;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);

    List<Booking> findByPartnerId(String partnerId);

    // Complex query for partner stats and filtering
    // We can use QueryDSL or Criteria API in service, but simple methods work too
    List<Booking> findByPartnerIdAndStatusIn(String partnerId, List<String> statuses);

    List<Booking> findByPartnerIdAndStatusInAndCreatedAtBetween(String partnerId, List<String> statuses, Date start,
            Date end);

    List<Booking> findByPartnerIdAndStatusInAndCreatedAtGreaterThanEqual(String partnerId, List<String> statuses,
            Date start);
}
