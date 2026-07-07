import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/public/PublicNavbar";
import Footer from "../components/public/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Users, Globe, Target, Eye, Heart, 
  MapPin, Award, BookOpen, Briefcase, Star, Building2,
  Plus, Minus, Search, Laptop, Network, BookOpenCheck, LineChart, Sparkles, Flame, CheckCircle2
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: { 
    y: [-10, 10, -10],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  }
};

const floatingAnimationDelayed = {
  initial: { y: 0 },
  animate: { 
    y: [10, -10, 10],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
  }
};

// --- REUSABLE COMPONENTS ---
const StatCounter = ({ end, suffix = "", label, theme = "light", colorClass }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 4000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  const textColor = colorClass || (theme === 'dark' ? 'text-white' : 'text-[#0F172A]');
  const labelColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-md border border-white/40 rounded-[20px] shadow-xl hover:-translate-y-1 transition-transform duration-300">
      <div className={`text-4xl md:text-5xl font-black mb-2 font-display ${textColor}`}>
        {count.toLocaleString()}{suffix}
      </div>
      {label && <div className={`text-xs font-bold uppercase tracking-widest text-center mt-1 ${labelColor}`}>{label}</div>}
    </div>
  );
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2563EB] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      
      {/* 1. STICKY HEADER */}
      <PublicNavbar />

      {/* 2. PREMIUM HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-slate-50 border-b border-[#E2E8F0]">
        
        {/* Dynamic Premium Background Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
          <div className="w-full max-w-7xl relative">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
              className="absolute -top-40 -right-20 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 via-indigo-200/30 to-purple-200/20 rounded-full blur-[80px]" 
            />
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-200/30 via-emerald-100/30 to-blue-50/20 rounded-full blur-[80px]" 
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Content */}
            <motion.div initial="hidden" animate="show" variants={stagger} className="flex-1 space-y-8 text-center lg:text-left relative z-20">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/50 rounded-full px-5 py-2.5 text-xs font-black text-[#2563EB] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/5">
                <Sparkles className="h-4 w-4" /> Premium Volunteer Platform
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] tracking-tight leading-[1.1] font-display drop-shadow-sm">
                Everyone has <br className="hidden lg:block"/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Power</span> to Impact
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Join India's most advanced network of young change-makers. Elevate your skills, track your impact, and build a world-class volunteering portfolio.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-6">
                <Link to="/register" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 active:scale-[0.98] shadow-xl shadow-blue-900/20">
                  Join the Network
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#programs" className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-8 py-4 text-base font-bold text-[#0F172A] hover:bg-slate-50 transition-all hover:scale-105 active:scale-[0.98] shadow-lg shadow-slate-200/50">
                  Explore Programs
                </a>
              </motion.div>

              {/* Avatar Stack */}
              <motion.div variants={fadeUp} className="pt-8 flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm">+5k</div>
                </div>
                <div className="text-sm font-semibold text-slate-500">Volunteers active this week</div>
              </motion.div>
            </motion.div>

            {/* Right Interactive Floaters */}
            <div className="flex-1 w-full relative h-[400px] lg:h-[600px] hidden md:block">
              <motion.div variants={floatingAnimation} initial="initial" animate="animate" className="absolute top-10 left-10 z-20">
                <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 w-64">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 text-green-600 p-2 rounded-xl"><CheckCircle2 className="w-5 h-5"/></div>
                    <span className="font-bold text-sm text-slate-800">Impact Verified</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-3/4 rounded-full"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={floatingAnimationDelayed} initial="initial" animate="animate" className="absolute bottom-20 right-10 z-30">
                <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border border-white/60 w-56 flex flex-col items-center text-center">
                  <div className="text-4xl font-black font-display text-blue-600 mb-1">100k+</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lives Touched</div>
                </div>
              </motion.div>

              {/* Main Image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-[40px] overflow-hidden shadow-2xl shadow-slate-300/50 border border-white">
                <img src="/disha-event2.jpg" className="w-full h-full object-cover opacity-90 mix-blend-multiply" alt="Volunteers in action" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. IMPACT & PARTNERS */}
      <section className="py-16 bg-white relative overflow-hidden border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by Leading Organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700 text-slate-500">
            <div className="flex items-center gap-2 text-lg font-black"><Building2 className="h-6 w-6" /> Gov Partners</div>
            <div className="flex items-center gap-2 text-lg font-black"><BookOpen className="h-6 w-6" /> State Univ</div>
            <div className="flex items-center gap-2 text-lg font-black"><Globe className="h-6 w-6" /> Global NGO</div>
            <div className="flex items-center gap-2 text-lg font-black"><Users className="h-6 w-6" /> India Cares</div>
            <div className="flex items-center gap-2 text-lg font-black"><Laptop className="h-6 w-6" /> Tech CSR</div>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM BENTO GRID (ABOUT) */}
      <section id="about" className="py-32 bg-slate-50 border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 rounded-full px-5 py-2.5 mb-6">Our Foundation</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-display mb-6">Designed for True Impact</h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium">We empower India's youth through structured volunteering, verified leadership development, and high-impact community projects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Bento 1: Large Vision (Spans 2 cols, 2 rows) */}
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-[32px] p-10 border border-slate-200 shadow-lg shadow-slate-200/50 relative overflow-hidden group flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-black text-[#0F172A] mb-3 font-display">Our Vision</h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md">We envision a society where every individual has access to quality education, practical skills, and opportunities to lead a healthy, happy, and prosperous life. We build the platform that makes this possible.</p>
              </div>
              <img src="/disha-founders.png" className="absolute -bottom-10 -right-10 w-2/3 object-contain opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Founders" />
            </div>

            {/* Bento 2: Mission */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-lg shadow-slate-200/50 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-5">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2 font-display">Mission</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Empowering students and professionals through volunteering, mentorship, and entrepreneurship to create leaders who drive positive social change.</p>
            </div>

            {/* Bento 3: Passion */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-lg shadow-slate-200/50 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-5">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A] mb-2 font-display">Passion</h3>
              <p className="text-slate-500 text-sm leading-relaxed">We believe in leading by example, inspiring individuals to discover their potential and make a meaningful impact every single day.</p>
            </div>

            {/* Bento 4: Goal (Spans 3 cols) */}
            <div className="md:col-span-3 bg-[#0F172A] rounded-[32px] p-10 shadow-2xl relative overflow-hidden group flex flex-col md:flex-row items-center justify-between hover:shadow-indigo-900/30 transition-all duration-500">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/30 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl text-center md:text-left mb-8 md:mb-0">
                <h3 className="text-3xl font-black text-white mb-3 font-display">Transforming Communities</h3>
                <p className="text-slate-400 text-lg leading-relaxed">Our goal is to expand across India by connecting youth, educators, NGOs, and communities to create sustainable impact and lifelong opportunities.</p>
              </div>
              <div className="relative z-10">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#0F172A] hover:scale-105 active:scale-[0.98] transition-transform">
                  Start Your Journey <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUCCESS STORIES (Premium Marquee / Cards) */}
      <section className="py-32 bg-white overflow-hidden border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-display mb-6">Stories of Impact</h2>
            <p className="text-slate-500 text-lg md:text-xl">Hear from the dedicated volunteers who are driving change across the nation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "Taught 50+ students coding", txt: "The verified certificates helped me secure my first tech internship! The platform is incredible.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
              { name: "Rahul Verma", role: "Planted 200 trees", txt: "The XP and leaderboard system made volunteering so much fun. I logged over 200 hours this year.", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" },
              { name: "Ananya Patel", role: "Organized blood drive", txt: "Managing volunteers used to be a nightmare. DISHA's dashboard streamlined our entire process.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" }
            ].map((story, i) => (
              <div key={i} className="bg-white border border-slate-200 p-10 rounded-[32px] shadow-xl shadow-slate-200/50 flex flex-col relative hover:-translate-y-2 transition-transform duration-500">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-[#F97316] text-[#F97316]" />)}
                </div>
                <p className="text-slate-700 text-lg leading-relaxed mb-10 flex-1 italic font-medium">"{story.txt}"</p>
                <div className="flex items-center gap-4">
                  <img src={story.img} alt={story.name} className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md" />
                  <div>
                    <h4 className="text-base font-black text-[#0F172A] font-display">{story.name}</h4>
                    <p className="text-sm font-bold text-[#2563EB] tracking-wide">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-[#0F172A] rounded-[40px] overflow-hidden relative shadow-2xl p-16 md:p-24 text-center">
            
            {/* Dynamic Animated Glows */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" 
            />
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" 
            />
            <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight font-display mb-8 leading-tight drop-shadow-lg">
                Become a Volunteer.<br />Build Your Future.
              </h2>
              <p className="text-slate-300 text-xl md:text-2xl mb-14 max-w-2xl mx-auto font-medium">
                Join the fastest growing network of young change-makers in India. Elevate your skills and transform communities today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link to="/register" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-bold text-[#0F172A] transition-all hover:scale-105 active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.6)]">
                  Register Now <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <Footer />

    </div>
  );
}
