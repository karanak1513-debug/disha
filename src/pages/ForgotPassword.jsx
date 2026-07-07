import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);
      await resetPassword(email);
      toast.success("Check your email inbox for password reset instructions!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background blobs for premium depth */}
      <div className="bg-glow-blob top-[-10%] left-[-10%]" />
      <div className="bg-glow-blob-orange bottom-[-10%] right-[-10%]" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl bg-white/95 p-8 shadow-xl shadow-slate-100/50 border border-slate-100/80 backdrop-blur-md">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-white font-black text-xl shadow-lg shadow-primary/25 mb-4">
            D
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight lg:text-3xl">Password Reset</h2>
          <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider leading-relaxed">
            Enter your email and we'll send reset instructions
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Email field */}
          <div>
            <label htmlFor="email-address" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                id="email-address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-primary transition-all duration-300"
                placeholder="name@disha.org"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full text-xs"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
