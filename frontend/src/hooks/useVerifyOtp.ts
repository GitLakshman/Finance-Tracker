import { useState } from "react";
import { VerifyOtp } from "../services/auth";
import axios from "axios";

export const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await VerifyOtp({ email, otp });
      if (response.status === 200) {
        setIsVerified(true);
        return true;
      }
      return false;
    } catch (err: unknown) {
      console.error("Verification error:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Verification failed");
      } else {
        setError("An unexpected error occurred");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { verify, loading, isVerified, error, setError };
};
