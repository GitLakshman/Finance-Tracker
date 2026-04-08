import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Login, SignUp } from "../../services/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../contexts/hooks/AppContex";
import { useAuth } from "../../contexts/hooks/useAuth";

const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

const signupSchema = z
  .object({
    firstName: z.string().min(2, "Name must be at least 2 characters long"),
    lastName: z.string().min(2, "Name must be at least 2 characters long"),
    email: z
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
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

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setEmail } = useAppContext();
  const { setAuth } = useAuth();
  const isLogin = location.pathname === "/login";

  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await Login(data);
      if (response.status === 200) {
        setAuth(response.data.token, response.data.userRole);
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Login failed. Please check your credentials.",
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSignupSubmit = async (data: z.infer<typeof signupSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await SignUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      if (response.status === 201) {
        setEmail(data.email);
        setDirection(-1);
        // Default signup flow leads to OTP, then Login
        navigate("/auth/verify-otp");
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      if (axios.isAxiosError(err)) {
        setError("Sign up failed. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAuth = () => {
    setError(null);
    setDirection(isLogin ? 1 : -1);
    navigate(isLogin ? "/signup" : "/login");
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
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
              {isLogin
                ? "Welcome back! Please enter your details."
                : "Create an account to start tracking."}
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 border border-red-200 text-red-600 text-[11px] py-2 px-3 rounded-lg font-medium mt-4 text-center mx-1"
              >
                {error}
              </motion.div>
            )}
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {isLogin ? (
                <motion.form
                  key="login"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 ml-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className={`w-full px-4 py-3 rounded-xl border ${loginForm.formState.errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-pink-400"} focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm text-black`}
                      placeholder="hello@example.com"
                      {...loginForm.register("email")}
                    />
                    {loginForm.formState.errors.email && (
                      <span className="text-red-500 text-xs ml-1 font-medium">
                        {loginForm.formState.errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 ml-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className={`w-full px-4 py-3 rounded-xl border ${loginForm.formState.errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-pink-400"} focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm text-black`}
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                    />
                    {loginForm.formState.errors.password && (
                      <span className="text-red-500 text-xs ml-1 font-medium">
                        {loginForm.formState.errors.password.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 px-4 bg-linear-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        <span>Signing In...</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={toggleAuth}
                      className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
                    >
                      <p className="inline text-gray-500">
                        Don't have an account?
                      </p>{" "}
                      Sign Up
                    </button>
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      Forgot Password
                    </Link>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className={`w-full px-4 py-3 rounded-xl border ${signupForm.formState.errors.firstName ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-pink-400"} focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm text-black`}
                        placeholder="John"
                        {...signupForm.register("firstName")}
                      />
                      {signupForm.formState.errors.firstName && (
                        <span className="text-red-500 text-xs ml-1 font-medium">
                          {signupForm.formState.errors.firstName.message}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className={`w-full px-4 py-3 rounded-xl border ${signupForm.formState.errors.lastName ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-pink-400"} focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm text-black`}
                        placeholder="Doe"
                        {...signupForm.register("lastName")}
                      />
                      {signupForm.formState.errors.lastName && (
                        <span className="text-red-500 text-xs ml-1 font-medium">
                          {signupForm.formState.errors.lastName.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="signup-email"
                      className="text-sm font-semibold text-gray-700 ml-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="signup-email"
                      className={`w-full px-4 py-3 rounded-xl border ${signupForm.formState.errors.email ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-pink-400"} focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm text-black`}
                      placeholder="hello@example.com"
                      {...signupForm.register("email")}
                    />
                    {signupForm.formState.errors.email && (
                      <span className="text-red-500 text-xs ml-1 font-medium">
                        {signupForm.formState.errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="signup-password"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="signup-password"
                        className={`w-full px-4 py-3 rounded-xl border ${signupForm.formState.errors.password ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-pink-400"} focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm text-black`}
                        placeholder="••••••••"
                        {...signupForm.register("password")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="confirm-password"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        Confirm
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className={`w-full px-4 py-3 rounded-xl border ${signupForm.formState.errors.confirmPassword ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-pink-400"} focus:ring-2 focus:border-transparent outline-none transition-all bg-white/70 backdrop-blur-sm shadow-sm text-black`}
                        placeholder="••••••••"
                        {...signupForm.register("confirmPassword")}
                      />
                    </div>
                  </div>
                  {(signupForm.formState.errors.password ||
                    signupForm.formState.errors.confirmPassword) && (
                    <span className="text-red-500 text-xs ml-1 font-medium">
                      {signupForm.formState.errors.password?.message ||
                        signupForm.formState.errors.confirmPassword?.message}
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 px-4 bg-linear-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={toggleAuth}
                      className="text-sm text-blue-500 hover:text-blue-600 cursor-pointer"
                    >
                      <p className="inline text-gray-500">
                        Already have an account?
                      </p>{" "}
                      Sign In
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
