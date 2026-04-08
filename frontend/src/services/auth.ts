import axios from "axios";
import {
  type LoginRequest,
  type LoginResponse,
  type OtpRequest,
  type OtpResponse,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type SignUpRequest,
  type SignUpResponse,
} from "../types/authTypes";

export const Login = (data: LoginRequest) => {
  return axios.post<LoginResponse>(
    "http://localhost:8080/api/auth/login",
    data,
  );
};

export const VerifyOtp = (data: OtpRequest) => {
  return axios.post<OtpResponse>(
    "http://localhost:8080/api/auth/verify-otp",
    data,
  );
};

export const ForgotPassword = (email: string) => {
  return axios.post<{ message: string }>(
    "http://localhost:8080/api/auth/forgot-password",
    null,
    { params: { email } },
  );
};

export const ResetPassword = (data: ResetPasswordRequest) => {
  return axios.post<ResetPasswordResponse>(
    "http://localhost:8080/api/auth/reset-password",
    data,
  );
};

export const SignUp = (data: SignUpRequest) => {
  return axios.post<SignUpResponse>(
    "http://localhost:8080/api/auth/signup",
    data,
  );
};
