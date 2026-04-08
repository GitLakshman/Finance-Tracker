package com.finance.tracker.service;

import jakarta.mail.MessagingException;

public interface OtpService {
    void sendOtp(String email) throws MessagingException;
    boolean verifyOtp(String email,  String otp);
}
