package com.finance.tracker.service.Impl;

import com.finance.tracker.entity.OtpEntity;
import com.finance.tracker.entity.UserEntity;
import com.finance.tracker.repository.OtpRepository;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.service.AuthService;
import com.finance.tracker.service.OtpService;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void forgetPassword(String email) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User With email id does not exists"));
        try {
            if (user.getEmail().equals(email)) {
                otpService.sendOtp(email);
            }
        } catch (MessagingException e) {
            throw new RuntimeException("Unable to send OTP");
        }
    }

    @Override
    @Transactional // Ensures database consistency
    public void resetPassword(String password, String email) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        OtpEntity otpEntity = otpRepository.findFirstByEmailOrderByVerifiedAtDesc(email).orElseThrow(() -> new RuntimeException("No OTP request found for this email"));

        if (Boolean.TRUE.equals(otpEntity.getIsVerified())) {
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            otpRepository.delete(otpEntity);

            System.out.println("Password reset successful for: " + email);
        } else {
            throw new RuntimeException("OTP has not been verified yet.");
        }
    }

}
