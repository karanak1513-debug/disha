import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-white py-4'} border-b border-[#E2E8F0]`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9] text-white font-bold text-base shadow-sm group-hover:bg-[#0284C7] transition-colors">D</span>
          <span className="font-bold text-[#0F172A] text-lg tracking-tight hidden sm:block">
            DISHA <span className="text-[#0EA5E9]">FOR INDIA</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          <a href="/#home" className="px-3 py-2 text-sm font-medium text-[#64748B] hover:text-[#0EA5E9] hover:bg-sky-50 rounded-md transition-all">Home</a>
          <a href="/#about" className="px-3 py-2 text-sm font-medium text-[#64748B] hover:text-[#0EA5E9] hover:bg-sky-50 rounded-md transition-all">About</a>
          <a href="/#programs" className="px-3 py-2 text-sm font-medium text-[#64748B] hover:text-[#0EA5E9] hover:bg-sky-50 rounded-md transition-all">Programs</a>
          <Link
            to="/blogs"
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${isActive('/blogs') ? 'text-[#0EA5E9] bg-sky-50' : 'text-[#64748B] hover:text-[#0EA5E9] hover:bg-sky-50'}`}
          >Blogs</Link>
          <Link
            to="/contact"
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${isActive('/contact') ? 'text-[#0EA5E9] bg-sky-50' : 'text-[#64748B] hover:text-[#0EA5E9] hover:bg-sky-50'}`}
          >Contact</Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors px-3 py-2 rounded-md hover:bg-slate-50">
            Log In
          </Link>
          <Link to="/register" className="btn-premium text-sm px-5 py-2.5">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
