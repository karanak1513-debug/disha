import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Heart, Globe, MapPin } from "lucide-react";

export default function ImpactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Active Volunteers", value: "10,000+", icon: <Users className="h-6 w-6 text-white" /> },
    { label: "Lives Impacted", value: "500K+", icon: <Heart className="h-6 w-6 text-white" /> },
    { label: "NGO Partners", value: "250+", icon: <Globe className="h-6 w-6 text-white" /> },
    { label: "Cities Reached", value: "50+", icon: <MapPin className="h-6 w-6 text-white" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#0F172A]">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-[#E2E8F0] py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold text-lg shadow-sm">D</span>
            <span className="font-bold text-slate-900 text-xl tracking-tight hidden sm:block">DISHA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Home</Link>
            <Link to="/our-programs" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Programs</Link>
            <Link to="/our-impact" className="text-sm font-bold text-[#2563EB]">Impact</Link>
            <Link to="/blogs" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Blogs</Link>
          </div>
          <Link to="/register" className="inline-flex items-center justify-center rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] shadow-sm">
            Volunteer Now
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative py-32 bg-[#0F172A] overflow-hidden text-center">
        {/* Background image overlay */}
        <div className="absolute inset-0 opacity-20">
          <img src="/impact_header_1783425922341.png" alt="Impact Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F172A]" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#38BDF8] bg-[#0284C7]/20 border border-[#38BDF8]/20 rounded-full px-4 py-2 mb-6">Our Impact</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6 text-white">Creating Change Together</h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Every action counts. Thanks to our dedicated volunteers and partners, we are making a measurable difference across the country.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500 text-white">
                  {stat.icon}
                </div>
                <div className="h-12 w-12 mx-auto bg-[#1E293B] rounded-full flex items-center justify-center mb-4 text-[#38BDF8]">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Logos Row (Similar to Landing) */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">Trusted by Global Organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Example SVGs for logos */}
            <svg className="h-8 text-slate-900" viewBox="0 0 100 30" fill="currentColor">
              <rect width="20" height="20" rx="4" />
              <text x="30" y="16" fontSize="16" fontWeight="bold" fontFamily="sans-serif">GlobalFund</text>
            </svg>
            <svg className="h-8 text-slate-900" viewBox="0 0 100 30" fill="currentColor">
              <circle cx="10" cy="10" r="10" />
              <text x="30" y="16" fontSize="16" fontWeight="bold" fontFamily="sans-serif">EcoVision</text>
            </svg>
            <svg className="h-8 text-slate-900" viewBox="0 0 120 30" fill="currentColor">
              <polygon points="10,0 20,20 0,20" />
              <text x="30" y="16" fontSize="16" fontWeight="bold" fontFamily="sans-serif">TechCares</text>
            </svg>
            <svg className="h-8 text-slate-900" viewBox="0 0 100 30" fill="currentColor">
              <path d="M0,10 Q10,0 20,10 T40,10" stroke="currentColor" strokeWidth="4" fill="none" />
              <text x="50" y="16" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Unity</text>
            </svg>
          </div>
        </div>
      </section>

    </div>
  );
}
