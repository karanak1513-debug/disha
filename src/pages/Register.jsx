import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Mail, Lock, User } from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      await signup(email, password, fullName);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to create account");
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
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-white font-black text-xl shadow-lg shadow-primary/25 mb-4">
            D
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight lg:text-3xl">Create your account</h2>
          <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Join the DISHA movement today
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Full Name field */}
          <div>
            <label htmlFor="fullname" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                id="fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-primary transition-all duration-300"
                placeholder="Aarav Sharma"
              />
            </div>
          </div>

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

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-primary transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Confirm Password field */}
          <div>
            <label htmlFor="confirm-password" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-primary transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full text-xs"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500 mt-6 font-semibold">
          Already have an account?{" "}
          <Link to="/login" className="font-extrabold text-primary hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
