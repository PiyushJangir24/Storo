package com.storo.backend.repository;

import com.storo.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.Date;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByResetTokenAndResetTokenExpiryGreaterThan(String resetToken, Date now);

    Optional<User> findByPartnerId(String partnerId);

    void deleteByPartnerId(String partnerId);
}
