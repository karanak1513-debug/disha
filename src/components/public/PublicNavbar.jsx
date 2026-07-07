import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Check initial scroll position
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || !isLanding ? 'bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#10B981] text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">D</span>
          <span className="font-bold text-slate-900 text-xl tracking-tight hidden sm:block">DISHA</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <a href="/#home" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Home</a>
          <a href="/#about" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">About</a>
          <Link to="/blogs" className={`text-sm font-semibold transition-colors ${location.pathname === '/blogs' ? 'text-[#10B981]' : 'text-slate-600 hover:text-[#10B981]'}`}>Blogs</Link>
          <Link to="/contact" className={`text-sm font-semibold transition-colors ${location.pathname === '/contact' ? 'text-[#10B981]' : 'text-slate-600 hover:text-[#10B981]'}`}>Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
            Login
          </Link>
          <Link to="/register" className="inline-flex items-center justify-center rounded-[10px] bg-[#10B981] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] shadow-sm">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
