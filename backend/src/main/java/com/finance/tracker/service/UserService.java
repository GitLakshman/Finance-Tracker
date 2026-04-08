package com.finance.tracker.service;

import com.finance.tracker.dto.RegisterRequest;

public interface UserService {
    void signUpUser(RegisterRequest request);
    boolean verifyUser(String email, String otp);
}
