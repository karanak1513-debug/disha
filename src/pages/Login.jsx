import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { Shield, Sparkles, Mail, Lock } from "lucide-react";

export default function Login() {
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
    <div className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background blobs for premium depth */}
      <div className="bg-glow-blob top-[-10%] left-[-10%]" />
      <div className="bg-glow-blob-orange bottom-[-10%] right-[-10%]" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl bg-white/95 p-8 shadow-xl shadow-slate-100/50 border border-slate-100/80 backdrop-blur-md">
        
        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-white font-black text-xl shadow-lg shadow-primary/25 mb-4">
            D
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight lg:text-3xl">
            Welcome back
          </h2>
          <p className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sign in to your DISHA portal
          </p>
        </div>

        {/* Credentials Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            
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
                  name="email"
                  type="email"
                  autoComplete="email"
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-extrabold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-primary transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-premium w-full text-xs"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-100" />
            <span className="absolute bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200/80 bg-white py-3 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all duration-300 shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
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
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-6 font-semibold">
          New to DISHA?{" "}
          <Link to="/register" className="font-extrabold text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
