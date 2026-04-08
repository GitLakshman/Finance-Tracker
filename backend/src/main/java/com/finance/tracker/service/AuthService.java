package com.finance.tracker.service;

public interface AuthService {
    void forgetPassword(String email);
    void resetPassword(String password, String email);
}
