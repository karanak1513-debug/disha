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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20 mb-4">
            D
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Password Reset</h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email address and we will send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Email field */}
          <div>
            <label htmlFor="email-address" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                id="email-address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="name@disha.org"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-2xl bg-primary py-3 px-4 text-sm font-bold text-white hover:bg-primary-hover focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
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
