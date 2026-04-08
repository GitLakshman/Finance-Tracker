import { useState } from "react";
import OtpInput from "react-otp-input";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/hooks/AppContex";
import { motion, AnimatePresence } from "framer-motion";
import { useVerifyOtp } from "../../hooks/useVerifyOtp";

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = useAppContext();
  const [otp, setOtp] = useState("");
  const { verify, loading, isVerified, error } = useVerifyOtp();

  // Determine where to navigate after successful verification
  const isForgotPasswordFlow = location.search.includes("flow=forgot-password");

  const onHandleVerify = async () => {
    const success = await verify(email, otp);
    if (success) {
      setTimeout(() => {
        if (isForgotPasswordFlow) {
          navigate("/auth/reset-password");
        } else {
          navigate("/login");
        }
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-400 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 p-10 transform-gpu transition-all">
        <AnimatePresence mode="wait">
          {!isVerified ? (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-pink-100 rounded-2xl mb-4 text-pink-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  Verify Your Email
                </h1>
                <p className="text-gray-500 text-sm max-w-[280px] mx-auto leading-relaxed">
                  We've sent a 6-digit verification code to <br />
                  <span className="font-semibold text-gray-700">{email}</span>
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-50 border border-red-200 text-red-600 text-[11px] py-2 px-3 rounded-lg font-medium mt-4"
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              <div className="mb-8">
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  shouldAutoFocus
                  inputType="number"
                  renderInput={(props) => (
                    <input
                      {...props}
                      className="h-14 w-12! text-center text-3xl font-bold border-2 border-gray-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  )}
                  containerStyle="flex justify-between gap-2"
                  inputStyle=""
                />
              </div>

              <button
                onClick={onHandleVerify}
                disabled={loading || otp.length < 6}
                className="w-full bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-pink-200 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
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
                      className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                    />
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="group inline-flex items-center gap-2 text-gray-500 hover:text-pink-500 font-semibold text-sm transition-all"
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
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-6 text-center"
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
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={4}
                    className="w-12 h-12"
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -inset-4 border-2 border-green-500 rounded-full"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Verified!
              </h2>
              <p className="text-gray-500 mb-2">
                Your account has been successfully verified.
              </p>
              <p className="text-sm font-medium text-green-600 animate-pulse">
                {isForgotPasswordFlow
                  ? "Taking you to reset password..."
                  : "Redirecting you to login..."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OtpPage;
