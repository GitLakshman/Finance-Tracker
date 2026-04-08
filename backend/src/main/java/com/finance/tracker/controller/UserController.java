package com.finance.tracker.controller;

import com.finance.tracker.dto.AuthRequest;
import com.finance.tracker.dto.OtpRequest;
import com.finance.tracker.dto.RegisterRequest;
import com.finance.tracker.service.AuthService;
import com.finance.tracker.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUpUser(@RequestBody RegisterRequest user) {
        try {
            userService.signUpUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User is registered successfully");
        } catch (Exception e) {
            throw new RuntimeException("Saved User in DB failed in UserService");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verify(@RequestBody OtpRequest otpRequest) {
        if (userService.verifyUser(otpRequest.getEmail(), otpRequest.getOtp())) {
            return ResponseEntity.ok("Verified User in DB");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired OTP.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            authService.forgetPassword(email);
            return ResponseEntity.ok("Otp sent to email : " + email);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody AuthRequest request) {
        try {
            authService.resetPassword(request.getPassword(), request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
