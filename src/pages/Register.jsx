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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20 mb-4">
            D
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Join the DISHA movement and start volunteering today
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Full Name field */}
          <div>
            <label htmlFor="fullname" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-5 w-5" />
              </span>
              <input
                id="fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="Aarav Sharma"
              />
            </div>
          </div>

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

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Confirm Password field */}
          <div>
            <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-2xl bg-primary py-3 px-4 text-sm font-bold text-white hover:bg-primary-hover focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
