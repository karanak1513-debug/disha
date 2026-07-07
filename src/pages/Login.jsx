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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
        
        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20 mb-4">
            D
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to start making an impact with DISHA
          </p>
        </div>

        {/* Credentials Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-xs">
            
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
                  name="email"
                  type="email"
                  autoComplete="email"
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-2xl bg-primary py-3 px-4 text-sm font-bold text-white hover:bg-primary-hover focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all cursor-pointer shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-100" />
            <span className="absolute bg-white px-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
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
          </div>
        </div>

        <div className="text-center text-sm text-slate-500 mt-6">
          New to DISHA?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
