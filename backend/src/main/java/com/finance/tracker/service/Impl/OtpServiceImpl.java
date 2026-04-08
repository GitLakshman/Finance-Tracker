package com.finance.tracker.service.Impl;

import com.finance.tracker.entity.OtpEntity;
import com.finance.tracker.repository.OtpRepository;
import com.finance.tracker.service.OtpService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final JavaMailSender mailSender;
    private final OtpRepository otpRepository;

    @Override
    public void sendOtp(String email) throws MessagingException {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit

        // Save to DB with 5-minute expiration
        OtpEntity record = new OtpEntity();
        record.setEmail(email);
        record.setOtp(otp);
        record.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        record.setIsVerified(false);
        otpRepository.save(record);

        // Send Email using MimeMessage
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(message, true);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        helper.setTo(email);
        helper.setSubject("Your Verification Code");
        helper.setText("<h3>Your OTP is: " + otp + "</h3><p>Expires in 5 mins.</p>", true);

        mailSender.send(message);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        return otpRepository.findByEmailAndOtp(email, otp).filter(record -> record.getExpiryTime().isAfter(LocalDateTime.now())).map(record -> {
            record.setIsVerified(true);
            record.setVerifiedAt(LocalDateTime.now());
            otpRepository.save(record);
            return true;
        }).orElse(false);

    }

    @Scheduled(cron = "0 0/30 * * * *")
    public void deleteExpiredOtp() {
        LocalDateTime now = LocalDateTime.now();
        otpRepository.deleteByExpiryTimeBefore(now);
        System.out.println("Expired OTPs cleared at: " + now);
    }
}
