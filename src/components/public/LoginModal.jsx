import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Mail, Lock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("disha1234@gmail.com");
  const [password, setPassword] = useState("disha123");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter email and password");
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Successfully logged in with Google!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to log in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-[0_20px_60px_-15px_rgb(0,0,0,0.1)] border border-[#E2E8F0] pointer-events-auto relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#00D09C] to-[#0066FF] text-white font-black text-2xl shadow-xl shadow-blue-500/20 mb-6">
                  D
                </div>
                <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
                  Welcome back
                </h2>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Sign in to your DISHA portal
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="modal-email"
                      className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        id="modal-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full bg-white border border-[#E2E8F0] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="modal-password"
                        className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest"
                      >
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        onClick={onClose}
                        className="text-[11px] font-bold text-[#2563EB] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        id="modal-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full bg-white border border-[#E2E8F0] rounded-[16px] py-3.5 pl-12 pr-4 text-sm font-black text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all tracking-[0.2em]"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563EB] text-white rounded-[16px] py-4 text-sm font-bold shadow-lg shadow-blue-500/25 hover:bg-[#1D4ED8] transition-all active:scale-[0.98]"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E2E8F0]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>

              {/* Google SignIn */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 bg-white border border-[#E2E8F0] rounded-[16px] py-4 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 3.01-1.07 4.03l3.05 2.37c1.79-1.65 2.82-4.08 2.82-7.25z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.05-2.37c-.9.6-2.01.96-3.23.96-2.48 0-4.58-1.67-5.33-3.92L5.22 18.08c1.77 3.51 5.39 5.92 9.49 5.92z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.67 15.76A7.12 7.12 0 0 1 6 12c0-.68.12-1.35.33-1.98L3.22 7.62c-.77 1.54-1.22 3.27-1.22 5.09s.45 3.55 1.22 5.09l3.45-2.04z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.9 0 4.28 2.41 2.51 5.92l3.45 2.04c.75-2.25 2.85-3.92 5.33-3.92z"
                  />
                </svg>
                Sign in with Google
              </button>

              {/* Footer */}
              <p className="mt-8 text-center text-sm font-semibold text-slate-500">
                New to DISHA?{" "}
                <Link
                  to="/register"
                  onClick={onClose}
                  className="text-[#2563EB] font-bold hover:underline"
                >
                  Register here
                </Link>
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
