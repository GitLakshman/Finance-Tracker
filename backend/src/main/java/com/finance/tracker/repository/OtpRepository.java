package com.finance.tracker.repository;

import com.finance.tracker.entity.OtpEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    Optional<OtpEntity> findByEmailAndOtp(String email, String otp);
    Optional<OtpEntity> findFirstByEmailOrderByVerifiedAtDesc(String email);

    @Transactional
    void deleteByExpiryTimeBefore(LocalDateTime now);
}
