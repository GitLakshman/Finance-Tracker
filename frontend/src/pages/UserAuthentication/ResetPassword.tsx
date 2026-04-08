import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ResetPassword as ResetPasswordService } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../contexts/hooks/AppContex";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { email } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      setError("Email is missing. Please restart the process.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await ResetPasswordService({
        email: email,
        password: data.password,
      });
      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to reset password. Please try again.",
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
              Create a new secure password for your account.
            </p>
          </div>

          <div className="relative min-h-[450px]">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="reset-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-2xl text-indigo-500">
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
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      New Password
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed px-4">
                      Set your new password for{" "}
                      <span className="font-semibold text-gray-700">
                        {email}
                      </span>
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
                        htmlFor="password"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        {...register("password")}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.password
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-200 focus:ring-indigo-400"
                        } focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm`}
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <span className="text-red-500 text-xs ml-1 font-medium">
                          {errors.password.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        {...register("confirmPassword")}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.confirmPassword
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-200 focus:ring-indigo-400"
                        } focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm`}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <span className="text-red-500 text-xs ml-1 font-medium">
                          {errors.confirmPassword.message}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-linear-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                          <span>Updating...</span>
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="relative mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1,
                      }}
                      className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(34,197,94,0.4)]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                        strokeWidth={4}
                        className="w-12 h-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -inset-4 border-2 border-green-500 rounded-full"
                    />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Password Reset!
                  </h2>
                  <p className="text-gray-500 mb-8 px-4">
                    Your password has been updated successfully.
                  </p>
                  <div className="flex items-center gap-2 text-green-600 font-bold text-sm animate-pulse bg-green-50 px-4 py-2 rounded-full">
                    <span>Finalizing... Redirecting to login</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
