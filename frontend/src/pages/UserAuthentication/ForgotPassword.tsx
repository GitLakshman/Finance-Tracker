import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ForgotPassword as ForgotPasswordService } from "../../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../contexts/hooks/AppContex";

const forgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { setEmail } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ForgotPasswordService(data.email);
      if (response.status === 200) {
        setEmail(data.email);
        // Navigate to OTP page with a flag indicating forgot-password flow
        navigate("/auth/verify-otp?flow=forgot-password");
      }
    } catch (err: unknown) {
      console.error("Forgot password error:", err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "An error occurred. Please check if the email is registered.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-400 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              Finance Tracker
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Enter your email to reset your password.
            </p>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key="forgot-password-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-7 h-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed px-4">
                    Don't worry! Enter your email and we'll send you a code to
                    reset your password.
                  </p>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-red-50 border border-red-100 text-red-500 text-[11px] py-2 px-3 rounded-lg font-medium mt-4 text-center mx-1"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 ml-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register("email")}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.email
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-200 focus:ring-blue-400"
                      } focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm`}
                      placeholder="hello@example.com"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs ml-1 font-medium">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-linear-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Sending Code...</span>
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </button>
                </form>

                <div className="mt-10 text-center">
                  <Link
                    to="/login"
                    className="group inline-flex items-center gap-2 text-gray-400 hover:text-blue-500 font-semibold text-sm transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back to Login
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
