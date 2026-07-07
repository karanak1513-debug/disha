import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, Heart, Users, Globe, Building2, BookOpen, 
  Laptop, ChevronRight, Play, Star, Shield, Trophy, 
  Target, Sparkles, TrendingUp, HandHeart
} from 'lucide-react';

import PublicNavbar from '../components/public/PublicNavbar';
import Footer from '../components/public/Footer';

// Animated Counter Component
const StatCounter = ({ end, suffix = "", label, colorClass = "text-blue-600" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    const duration = 2000;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;
      
      if (progress < 1) {
        setCount(Math.floor(end * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end]);

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <h3 className={`text-5xl lg:text-7xl font-black tracking-tight font-display ${colorClass}`}>
        {count.toLocaleString()}{suffix}
      </h3>
      <p className="text-sm font-bold uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  );
};

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#2563EB] selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* 1. HERO SECTION (Minimal & Animated) */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#fafafa]">
        {/* Subtle Parallax Background */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-gradient-to-tr from-blue-100/40 to-indigo-50/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-4xl mx-auto space-y-10">
            
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full px-5 py-2.5 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping absolute"></span>
              <span className="flex h-2 w-2 rounded-full bg-blue-500 relative"></span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">Join 100,000+ Volunteers</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-bold text-[#0F172A] tracking-tighter leading-[1.05] font-display">
              Empowering India's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Youth & Future</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              We build future-ready leaders through high-impact volunteering, skill development, and community-driven initiatives.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Link to="/register" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-[20px] bg-[#0F172A] px-10 py-5 text-lg font-bold text-white overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.5)]">
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              <a href="#about" className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[20px] bg-white border border-slate-200 px-10 py-5 text-lg font-bold text-[#0F172A] hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm hover:shadow-md">
                Learn More
              </a>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 2. LOGO CLOUD */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10">Trusted by Leading Organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 text-slate-800">
            <div className="flex items-center gap-3 text-xl font-black tracking-tight"><Building2 className="h-7 w-7" /> Gov Partners</div>
            <div className="flex items-center gap-3 text-xl font-black tracking-tight"><BookOpen className="h-7 w-7" /> State Univ</div>
            <div className="flex items-center gap-3 text-xl font-black tracking-tight"><Globe className="h-7 w-7" /> Global NGO</div>
            <div className="flex items-center gap-3 text-xl font-black tracking-tight"><Users className="h-7 w-7" /> India Cares</div>
          </div>
        </div>
      </section>

      {/* 3. BENTO BOX ABOUT SECTION */}
      <section id="about" className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-display text-[#0F172A] mb-6">Redefining Impact.</h2>
            <p className="text-xl text-slate-500 max-w-2xl font-medium">We aren't just a volunteering platform. We are a movement dedicated to holistic youth development and tangible social change.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Main Large Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 bg-white rounded-[32px] p-10 md:p-16 border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8 text-blue-600 group-hover:scale-110 transition-transform duration-500">
                  <Target className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#0F172A] mb-4 font-display">Our Mission</h3>
                  <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                    We empower students and young professionals through volunteering, mentorship, skill development, and entrepreneurship, creating future-ready leaders who drive positive social change across India.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Top Right Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#0F172A] text-white rounded-[32px] p-10 border border-slate-800 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-sm">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-display">Our Vision</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Empowering a skilled and progressive India where every individual has access to quality education, practical skills, and opportunities to lead a prosperous life.
                </p>
              </div>
            </motion.div>

            {/* Bottom Left Small Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-orange-50 rounded-[32px] p-10 border border-orange-100 group hover:bg-orange-100 transition-colors duration-500"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-orange-500 shadow-sm">
                <HandHeart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-display">Passion</h3>
              <p className="text-orange-800/70 text-sm">Inspiring purpose-driven change every single day.</p>
            </motion.div>

            {/* Bottom Right Small Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-emerald-50 rounded-[32px] p-10 border border-emerald-100 group hover:bg-emerald-100 transition-colors duration-500 md:col-span-2"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center justify-between h-full">
                <div>
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 text-emerald-600 shadow-sm">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2 font-display">National Goal</h3>
                  <p className="text-emerald-800/70 text-base max-w-md">Transforming communities nationwide by connecting youth, educators, and NGOs to create sustainable impact.</p>
                </div>
                <div className="hidden md:flex w-32 h-32 rounded-full bg-emerald-200/50 items-center justify-center relative">
                  <Globe className="h-12 w-12 text-emerald-600 animate-pulse" />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. ANIMATED STATS */}
      <section className="py-32 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <StatCounter end={100} suffix="K+" label="Lives Touched" colorClass="text-blue-600" />
            <StatCounter end={500} suffix="+" label="Schools Covered" colorClass="text-indigo-600" />
            <StatCounter end={10} suffix="K+" label="Active Volunteers" colorClass="text-purple-600" />
            <StatCounter end={50} suffix="+" label="Cities Reached" colorClass="text-emerald-600" />
          </div>
        </div>
      </section>

      {/* 5. SUCCESS STORIES CAROUSEL */}
      <section className="py-32 bg-[#0F172A] overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-display text-white mb-6">Voices of Impact</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Hear directly from the young leaders transforming India through our programs.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya S.", role: "Lead Tech Volunteer", txt: "The verified certificates helped me secure my first tech internship. The platform is incredible." },
              { name: "Rahul V.", role: "Environment Advocate", txt: "The XP and leaderboard system made volunteering so much fun. I logged over 200 hours this year!" },
              { name: "Ananya P.", role: "Event Coordinator", txt: "Managing volunteers used to be a nightmare. DISHA's dashboard streamlined our entire process." }
            ].map((story, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] hover:bg-white/10 transition-colors group"
              >
                <div className="flex gap-1 mb-8">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-slate-300 leading-relaxed mb-10 text-lg italic font-medium">"{story.txt}"</p>
                <div className="flex items-center gap-4 pt-8 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{story.name}</h4>
                    <p className="text-sm font-semibold text-blue-400">{story.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PREMIUM CTA */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-12 md:p-24 text-center text-white shadow-2xl relative overflow-hidden"
          >
            {/* Animated Glare */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40 animate-[shimmer_3s_infinite]" />
            
            <h2 className="text-4xl md:text-7xl font-bold tracking-tight font-display mb-8 relative z-10">
              Ready to Shape <br /> the Future?
            </h2>
            <p className="text-blue-100 text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-medium relative z-10">
              Join the fastest growing network of young change-makers in India. Elevate your skills and transform communities today.
            </p>
            
            <div className="relative z-10">
              <Link to="/register" className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-12 py-6 text-xl font-bold text-blue-600 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.8)]">
                Register as a Volunteer
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
