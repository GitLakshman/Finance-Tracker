package com.finance.tracker.service.Impl;

import com.finance.tracker.dto.RegisterRequest;
import com.finance.tracker.entity.UserEntity;
import com.finance.tracker.repository.UserRepository;
import com.finance.tracker.service.OtpService;
import com.finance.tracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final UserRepository userRepository;

    @Override
    public void signUpUser(RegisterRequest request) {
        UserEntity user = convertToEntity(request);
        userRepository.save(user);
        try {
            otpService.sendOtp(user.getEmail());
        } catch (Exception e) {
            throw new RuntimeException("Otp send failed in UserService");
        }
    }

    @Override
    public boolean verifyUser(String email, String otp) {
        if (otpService.verifyOtp(email, otp)) {
            UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
            user.setIsVerified(true);
            userRepository.save(user); // Optional with @Transactional
        }
        return true;
    }

    private UserEntity convertToEntity(RegisterRequest request) {
        return UserEntity.builder().userId(UUID.randomUUID().toString()).username(request.getFirstName() + " " + request.getLastName()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).isVerified(false).userRole("ROLE_USER").build();
    }
}
