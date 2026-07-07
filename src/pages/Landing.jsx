import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/public/PublicNavbar';
import Footer from '../components/public/Footer';
import { motion } from 'framer-motion';
import {
  ArrowRight, Users, Target, Calendar, Award, Star, TrendingUp, CheckCircle, Quote,
  Heart, Building2, BookOpen, Brain, Sparkles, Zap, Shield, Play, ChevronRight, Eye, Flame, MapPin
} from 'lucide-react';

// --- PREMIUM ANIMATION VARIANTS ---
const textReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const floatAnim = {
  y: [0, -15, 0],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
};

const floatAnimReverse = {
  y: [0, 15, 0],
  transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
};

// --- REUSABLE COMPONENTS ---
const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative group ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {children}
  </div>
);

const GlowingOrb = ({ color, className = "" }) => (
  <div className={`absolute rounded-full blur-[120px] pointer-events-none mix-blend-screen ${color} ${className}`} />
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-[#06B6D4] selection:text-white font-sans overflow-x-hidden text-slate-300">
      <PublicNavbar />

      {/* 1. HERO SECTION (Dark Parallax) */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Deep Space Background Elements */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-0" />
        <GlowingOrb color="bg-cyan-500/20" className="w-[600px] h-[600px] top-[-20%] right-[-10%]" />
        <GlowingOrb color="bg-indigo-500/20" className="w-[500px] h-[500px] bottom-[-10%] left-[-10%]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            
            {/* Left: Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div initial="hidden" animate="show" variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-cyan-400 tracking-widest uppercase mb-8 backdrop-blur-md">
                <Sparkles className="h-3 w-3" /> WE EMPOWER | WE MAKE THE DIFFERENCE
              </motion.div>

              <motion.div initial="hidden" animate="show" variants={textReveal} className="overflow-hidden mb-6">
                <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] font-display">
                  Everyone has <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Power</span> to create an Impact
                </h1>
              </motion.div>
              
              <motion.p initial="hidden" animate="show" variants={fadeUp} className="text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium tracking-wide mb-10">
                Be a Volunteer with Disha For India. Invest your time, uplift lives, and build a better India — one community at a time.
              </motion.p>
              
              <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#020617] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                  Start Volunteering <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#programs" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95 backdrop-blur-sm">
                  <Play className="h-4 w-4" /> Watch Story
                </a>
              </motion.div>

              {/* Mini Social Proof */}
              <motion.div initial="hidden" animate="show" variants={fadeUp} className="mt-12 flex items-center justify-center lg:justify-start gap-4 pt-8 border-t border-white/10">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80",
                  ].map((img, i) => (
                    <img key={i} src={img} alt="Volunteer" className="w-10 h-10 rounded-full border-2 border-[#020617] object-cover" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-amber-400 text-[10px]">
                    <Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" />
                  </div>
                  <span className="font-bold text-white">5.0</span> <span className="text-slate-500">from 2k+ volunteers</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Floating Hero Graphic */}
            <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[600px] flex items-center justify-center perspective-1000">
              <GlowingOrb color="bg-emerald-500/20" className="w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              
              <motion.div animate={floatAnim} className="absolute z-20 w-3/4 max-w-[400px]">
                <img src="/disha-hero.png" alt="Volunteers making an impact" className="w-full h-auto drop-shadow-2xl rounded-2xl border border-white/10" />
              </motion.div>
              
              <motion.div animate={floatAnimReverse} className="absolute top-1/4 right-0 z-30 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Volunteers</p>
                  <p className="text-xl font-black text-white">5,000+</p>
                </div>
              </motion.div>

              <motion.div animate={floatAnim} className="absolute bottom-1/4 left-0 z-30 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl">
                <p className="text-[10px] font-bold text-slate-400 italic leading-relaxed max-w-[150px]">"Education is the most powerful weapon which can be used to change the world."</p>
                <p className="text-[9px] font-bold text-cyan-400 mt-2 uppercase tracking-widest">— Nelson Mandela</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT DISHA (Dark Glassmorphism) */}
      <section id="about" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-4">Our Story</span>
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={textReveal} className="text-4xl md:text-6xl font-black tracking-tighter font-display mb-6 text-white">About DISHA</motion.h2>
            <p className="text-slate-400 text-xl font-medium tracking-wide">Empowering India's youth through volunteering, leadership, skill development, and community impact.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-8 mb-16">
            
            {/* Left: Founders Card */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="lg:w-2/5 w-full">
              <GlassCard className="h-full p-2 flex flex-col">
                <div className="rounded-[24px] overflow-hidden relative flex-grow min-h-[300px]">
                  <img src="/disha-founders.png" alt="DISHA for India Founders" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Founded with</p>
                    <p className="text-3xl font-black font-display text-white">Purpose</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Right: Vision/Mission Grid */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="lg:w-3/5 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Vision", icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "hover:border-cyan-500/30", sub: "Empowering a Skilled & Progressive India", desc: "We envision a society where every individual has access to quality education, practical skills, and opportunities to lead a healthy, happy, and prosperous life." },
                { title: "Mission", icon: Target, color: "text-amber-400", bg: "bg-amber-500/10", border: "hover:border-amber-500/30", sub: "Building Future-Ready Youth", desc: "We empower students and young professionals through volunteering, mentorship, skill development, and entrepreneurship, creating leaders who drive positive social change." },
                { title: "Passion", icon: Flame, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/30", sub: "Inspiring Purpose-Driven Change", desc: "We believe in leading by example, encouraging individuals to discover their potential, contribute to society, and make a meaningful impact every day." },
                { title: "Goal", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10", border: "hover:border-purple-500/30", sub: "Transforming Communities Nationwide", desc: "Our goal is to expand across India by connecting youth, educators, NGOs, and communities to create sustainable impact and lifelong opportunities." },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <GlassCard className={`p-8 h-full transition-colors ${item.border}`}>
                    <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center mb-6`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                    <p className={`text-[10px] font-bold ${item.color} mb-4 uppercase tracking-[0.2em]`}>{item.sub}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. IMPACT & PARTNERS */}
      <section className="py-24 relative border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-12">Trusted by Leading Organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 text-slate-400">
              <div className="flex items-center gap-2 text-lg font-black"><Building2 className="h-6 w-6" /> Gov Partners</div>
              <div className="flex items-center gap-2 text-lg font-black"><Users className="h-6 w-6" /> NGOs Network</div>
              <div className="flex items-center gap-2 text-lg font-black"><BookOpen className="h-6 w-6" /> EdTech Corps</div>
              <div className="flex items-center gap-2 text-lg font-black"><Shield className="h-6 w-6" /> Corporate CSR</div>
            </div>
          </div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Volunteers", val: "5,000+", icon: Users, color: "text-cyan-400" },
              { label: "Programs", val: "20+", icon: Target, color: "text-emerald-400" },
              { label: "Events", val: "100+", icon: Calendar, color: "text-purple-400" },
              { label: "Awards", val: "15+", icon: Award, color: "text-amber-400" }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard className="p-8 text-center hover:scale-[1.02] transition-transform">
                  <stat.icon className={`h-8 w-8 mx-auto mb-4 ${stat.color} opacity-80`} />
                  <p className="text-4xl font-black text-white font-display mb-2">{stat.val}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. WHAT WE DO (Programs) */}
      <section id="programs" className="py-32 relative">
        <GlowingOrb color="bg-purple-500/10" className="w-[800px] h-[800px] top-0 right-0 -translate-y-1/2 translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={textReveal} className="text-4xl md:text-6xl font-black tracking-tighter font-display mb-6 text-white">Our Programs</motion.h2>
            <p className="text-slate-400 text-xl font-medium tracking-wide">Comprehensive initiatives designed to holistically develop the youth.</p>
          </div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Skill Development", desc: "Equipping youth with in-demand practical skills.", icon: Zap, img: "/disha-skill.png" },
              { title: "Education & Literacy", desc: "Bridging the gap for underprivileged children.", icon: BookOpen, img: "/disha-edu.jpg" },
              { title: "Financial Literacy", desc: "Teaching financial independence and management.", icon: TrendingUp, img: "/disha-fin.jpg" },
              { title: "Emotional Wellness", desc: "Fostering mental health and emotional resilience.", icon: Brain, img: "/disha-health.jpg" }
            ].map((prog, i) => (
              <motion.div key={i} variants={fadeUp} className="group relative rounded-3xl overflow-hidden cursor-pointer h-[400px]">
                <img src={prog.img} alt={prog.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <prog.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{prog.title}</h3>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">{prog.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. EVENT HIGHLIGHTS */}
      <section className="py-32 relative bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/2">
              <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={textReveal} className="text-4xl md:text-5xl font-black text-white tracking-tighter font-display mb-6">Experience the Impact</motion.h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-medium">
                Our events, workshops, and seminars are platforms where change happens. From emotional wellness sessions to massive community drives, we bring people together.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Pan-India Reach", desc: "Operating in multiple states with thousands of active volunteers." },
                  { title: "Expert Led Sessions", desc: "Learn directly from industry leaders and wellness coaches." },
                  { title: "Community Driven", desc: "Every event directly benefits a local community in need." }
                ].map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 text-cyan-400" />
                      <h4 className="text-lg font-bold text-white">{f.title}</h4>
                    </div>
                    <p className="text-sm text-slate-400 pl-8 font-medium">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-[24px] overflow-hidden h-[300px] relative group border border-white/10">
                    <img src="/disha-event1.jpg" alt="DISHA Seminar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <div className="rounded-[24px] overflow-hidden h-[200px] relative group border border-white/10">
                    <img src="/disha-event2.jpg" alt="DISHA Event" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="rounded-[24px] overflow-hidden h-[200px] relative group border border-white/10">
                    <img src="/disha-event3.jpg" alt="DISHA Workshop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <div className="rounded-[24px] overflow-hidden h-[300px] relative group border border-white/10">
                    <img src="/disha-event4.jpg" alt="DISHA Training" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                </div>
              </div>
              
              {/* Glass Badge */}
              <motion.div animate={floatAnim} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020617]/80 backdrop-blur-xl p-6 rounded-[24px] shadow-2xl flex items-center gap-5 border border-white/20">
                <div className="bg-cyan-500/20 p-4 rounded-xl">
                  <Heart className="h-8 w-8 text-cyan-400 fill-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Lives Touched</p>
                  <p className="text-3xl font-black text-white">100,000+</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SUCCESS STORIES */}
      <section className="py-32 relative">
        <GlowingOrb color="bg-indigo-500/10" className="w-[800px] h-[800px] top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={textReveal} className="text-4xl md:text-6xl font-black tracking-tighter font-display mb-6 text-white">Success Stories</motion.h2>
            <p className="text-slate-400 text-xl font-medium tracking-wide">Real impact from India's most dedicated student volunteers.</p>
          </div>
          
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "Taught 50+ students coding", txt: "The verified certificates helped me secure my first tech internship! The platform is incredible.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
              { name: "Rahul Verma", role: "Planted 200 trees", txt: "The XP and leaderboard system made volunteering so much fun. I logged over 200 hours this year.", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" },
              { name: "Ananya Patel", role: "Organized blood drive", txt: "Managing volunteers used to be a nightmare. DISHA's dashboard streamlined our entire process.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" }
            ].map((story, i) => (
              <motion.div key={i} variants={fadeUp}>
                <GlassCard className="p-10 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-10 flex-1 italic font-medium">"{story.txt}"</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                    <img src={story.img} alt={story.name} className="h-12 w-12 rounded-full object-cover border border-white/20" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{story.name}</h4>
                      <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mt-1">{story.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[40px] overflow-hidden relative shadow-2xl border border-white/10 p-12 lg:p-24 text-center">
            
            <GlowingOrb color="bg-cyan-500/40" className="w-[500px] h-[500px] top-0 right-0 -translate-y-1/2 translate-x-1/3" />
            <GlowingOrb color="bg-purple-500/40" className="w-[400px] h-[400px] bottom-0 left-0 translate-y-1/3 -translate-x-1/4" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay z-0" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter font-display mb-8 leading-tight">
                Become a Volunteer.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Create Impact.</span>
              </h2>
              <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto font-medium tracking-wide">
                Join the fastest growing network of young change-makers in India. Elevate your skills and transform communities today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-10 py-5 text-base font-bold text-[#020617] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.6)]">
                  Register Now <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#programs" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/20 px-10 py-5 text-base font-bold text-white transition-all hover:bg-white/10 active:scale-95 backdrop-blur-md">
                  Explore Programs
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
