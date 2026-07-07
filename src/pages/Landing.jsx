import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Users, Globe, Target, Eye, Heart, 
  MapPin, Award, BookOpen, Briefcase, Star, Building2,
  Plus, Minus, Search, Laptop, Network, BookOpenCheck, LineChart, Sparkles, Flame
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// --- REUSABLE COMPONENTS ---

const StatCounter = ({ end, suffix = "", label, theme = "light", colorClass }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 5000;
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
  const labelColor = theme === 'dark' ? 'text-slate-400 group-hover:text-white transition-colors' : 'text-slate-500';

  return (
    <div className={`flex flex-col items-center justify-center ${theme === 'dark' ? '' : 'p-6 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm'}`}>
      <div className={`text-4xl md:text-5xl font-black mb-2 font-display ${textColor}`}>
        {count.toLocaleString()}{suffix}
      </div>
      {label && <div className={`text-xs font-bold uppercase tracking-widest text-center mt-1 ${labelColor}`}>{label}</div>}
    </div>
  );
};

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-[#E2E8F0] rounded-[16px] overflow-hidden bg-white mb-4 transition-all hover:border-slate-300">
      <button 
        onClick={onClick}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-bold text-[#0F172A] text-lg pr-4">{question}</span>
        <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500'}`}>
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2563EB] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      
      {/* 1. TRANSPARENT STICKY HEADER */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold text-lg shadow-sm">D</span>
            <span className="font-bold text-slate-900 text-xl tracking-tight hidden sm:block">DISHA</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'About', 'Programs', 'Events', 'Impact', 'Partners', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Login
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white border-b border-[#E2E8F0]">
        {/* Soft Background Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
          <div className="w-full max-w-7xl relative">
            <div className="absolute -top-24 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div initial="hidden" animate="show" variants={stagger} className="flex-1 space-y-8 text-center lg:text-left">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 text-xs font-bold text-[#2563EB] uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> WE EMPOWER | WE MAKE THE DIFFERENCE
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold text-[#0F172A] tracking-tight leading-[1.1] font-display">
                Everyone has <span className="text-[#2563EB]">Power</span> to create an Impact
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Be a Volunteer with Disha For India. Invest your time, uplift lives, and build a better India — one community at a time.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#2563EB] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] shadow-sm">
                  Be a Volunteer with Disha
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#programs" className="w-full sm:w-auto inline-flex items-center justify-center rounded-[12px] bg-white border border-[#E2E8F0] px-8 py-4 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC] hover:border-slate-300 transition-all active:scale-[0.98] shadow-sm">
                  Explore Programs
                </a>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex-1 w-full relative">
              <div className="relative rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-2xl aspect-[4/3] bg-slate-100 group">
                <img
                  src="/disha-event.jpg"
                  alt="DISHA for India Community Event"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-[12px] p-4 border border-white shadow-lg"
                >
                  <p className="text-xs font-bold text-slate-700 italic leading-relaxed">"Education is the most powerful weapon which can be used to change the world."</p>
                  <p className="text-[10px] font-bold text-[#2563EB] mt-1 uppercase tracking-widest">— Nelson Mandela</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      <section id="about" className="py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-4">Our Story</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-4">About DISHA</h2>
            <p className="text-slate-500 text-lg font-medium">Empowering India's youth through volunteering, leadership, skill development, and community impact.</p>
          </div>

          {/* Two-Column Layout */}
          <div className="flex flex-col lg:flex-row items-start gap-12 mb-16">

            {/* LEFT: Founders Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:w-2/5 w-full shrink-0"
            >
              <div className="relative">
                <div className="rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-xl">
                  <img
                    src="/disha-founders.png"
                    alt="DISHA for India Founders"
                    className="w-full object-cover"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-5 -right-5 bg-[#2563EB] text-white rounded-[16px] p-5 shadow-2xl">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Founded with</p>
                  <p className="text-2xl font-black font-display mt-1">Purpose</p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: 2x2 Cards Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {/* Vision */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-[20px] hover:border-blue-200 hover:shadow-lg transition-all group">
                <div className="h-12 w-12 rounded-[12px] bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                  <Eye className="h-6 w-6 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mb-1">Vision</h3>
                <p className="text-xs font-bold text-[#2563EB] mb-3 uppercase tracking-widest">Empowering a Skilled & Progressive India</p>
                <p className="text-slate-500 text-sm leading-relaxed">We envision a society where every individual has access to quality education, practical skills, and opportunities to lead a healthy, happy, and prosperous life.</p>
              </div>

              {/* Mission */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-[20px] hover:border-orange-200 hover:shadow-lg transition-all group">
                <div className="h-12 w-12 rounded-[12px] bg-orange-50 flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
                  <Target className="h-6 w-6 text-[#F97316]" />
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mb-1">Mission</h3>
                <p className="text-xs font-bold text-[#F97316] mb-3 uppercase tracking-widest">Building Future-Ready Youth</p>
                <p className="text-slate-500 text-sm leading-relaxed">We empower students and young professionals through volunteering, mentorship, skill development, and entrepreneurship, creating leaders who drive positive social change.</p>
              </div>

              {/* Passion */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-[20px] hover:border-emerald-200 hover:shadow-lg transition-all group">
                <div className="h-12 w-12 rounded-[12px] bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                  <Flame className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mb-1">Passion</h3>
                <p className="text-xs font-bold text-emerald-600 mb-3 uppercase tracking-widest">Inspiring Purpose-Driven Change</p>
                <p className="text-slate-500 text-sm leading-relaxed">We believe in leading by example, encouraging individuals to discover their potential, contribute to society, and make a meaningful impact every day.</p>
              </div>

              {/* Goal */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-[20px] hover:border-purple-200 hover:shadow-lg transition-all group">
                <div className="h-12 w-12 rounded-[12px] bg-purple-50 flex items-center justify-center mb-5 group-hover:bg-purple-100 transition-colors">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mb-1">Goal</h3>
                <p className="text-xs font-bold text-purple-600 mb-3 uppercase tracking-widest">Transforming Communities Nationwide</p>
                <p className="text-slate-500 text-sm leading-relaxed">Our goal is to expand across India by connecting youth, educators, NGOs, and communities to create sustainable impact and lifelong opportunities.</p>
              </div>
            </motion.div>
          </div>

          {/* Quote Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0F172A] rounded-[24px] p-12 text-center text-white flex flex-col items-center"
          >
            <div className="text-5xl mb-4 opacity-30 font-serif leading-none">"</div>
            <p className="text-2xl md:text-3xl font-bold font-display leading-snug italic max-w-3xl mx-auto text-white">
              Education is the most powerful weapon which can be used to change the world.
            </p>
            <p className="text-slate-400 text-sm font-bold mt-6 uppercase tracking-widest">— Nelson Mandela</p>
          </motion.div>

        </div>
      </section>

      {/* 3. IMPACT & PARTNERS (Redesigned) */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"></div>
          <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[60%] rounded-full bg-emerald-600/10 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Partners Row */}
          <div className="mb-20 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-10">Trusted by Leading Organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 text-white">
              <div className="flex items-center gap-2 text-xl font-black"><Building2 className="h-7 w-7 text-white" /> Gov Partners</div>
              <div className="flex items-center gap-2 text-xl font-black"><BookOpen className="h-7 w-7 text-white" /> State Univ</div>
              <div className="flex items-center gap-2 text-xl font-black"><Globe className="h-7 w-7 text-white" /> Global NGO</div>
              <div className="flex items-center gap-2 text-xl font-black"><Users className="h-7 w-7 text-white" /> India Cares</div>
              <div className="flex items-center gap-2 text-xl font-black"><Laptop className="h-7 w-7 text-white" /> Tech CSR</div>
            </div>
          </div>

          <div className="w-full h-px bg-white/10 mb-20"></div>

          {/* Glowing Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { end: 10000, suffix: "+", label: "Healthcare Impact", color: "text-blue-400" },
              { end: 500, suffix: "+", label: "Schools Covered", color: "text-orange-400" },
              { end: 100000, suffix: "+", label: "People Trained", color: "text-emerald-400" },
              { end: 5000, suffix: "+", label: "Financial Literacy", color: "text-purple-400" },
              { end: 5000, suffix: "+", label: "Community Development", color: "text-rose-400" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <StatCounter end={stat.end} suffix={stat.suffix} label={stat.label} theme="dark" colorClass={stat.color} />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. WHY CHOOSE DISHA (Asymmetric Layout) */}
      <section className="py-24 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Left: Text & Features */}
            <div className="lg:w-1/2">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F97316] bg-orange-50 border border-orange-100 rounded-full px-4 py-2 mb-6">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-display text-[#0F172A] mb-6">
                Why Choose Disha For India?
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-12">
                Empowering individuals to create meaningful social impact through volunteering, leadership, and community engagement.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  {
                    icon: Search,
                    iconColor: "text-[#2563EB]",
                    iconBg: "bg-blue-50",
                    title: "Meaningful Volunteering",
                    desc: "Engage in purpose-driven campaigns across education, healthcare, and sustainability to create measurable, real-world impact.",
                  },
                  {
                    icon: BookOpenCheck,
                    iconColor: "text-[#F97316]",
                    iconBg: "bg-orange-50",
                    title: "Practical Skill Building",
                    desc: "Cultivate essential competencies in leadership, communication, and project management through hands-on experience and expert mentorship.",
                  },
                  {
                    icon: Target,
                    iconColor: "text-emerald-600",
                    iconBg: "bg-emerald-50",
                    title: "Empowered Leadership",
                    desc: "Spearhead grassroots initiatives, coordinate volunteer cohorts, and execute high-impact projects that drive lasting social change.",
                  },
                  {
                    icon: LineChart,
                    iconColor: "text-purple-600",
                    iconBg: "bg-purple-50",
                    title: "Accelerated Career Growth",
                    desc: "Fortify your professional portfolio with demonstrable social impact, distinguishing yourself for top-tier internships and higher education.",
                  },
                  {
                    icon: Award,
                    iconColor: "text-rose-500",
                    iconBg: "bg-rose-50",
                    title: "Verified Certification",
                    desc: "Earn officially recognized credentials that validate your dedication, leadership, and tangible contributions to the community.",
                  },
                  {
                    icon: Globe,
                    iconColor: "text-indigo-600",
                    iconBg: "bg-indigo-50",
                    title: "Sustainable Impact",
                    desc: "Play a pivotal role in scalable initiatives designed to uplift marginalized groups, democratize education, and build resilient societies.",
                  }
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col"
                  >
                    <div className={`h-12 w-12 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}>
                      <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                    </div>
                    <h4 className="text-lg font-bold text-[#0F172A] mb-2">{f.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Modern 4-Image Grid */}
            <div className="lg:w-1/2 w-full relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden h-[300px] shadow-sm group relative">
                    <img src="/disha-event1.jpg" alt="DISHA Seminar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 border border-black/5 rounded-3xl" />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-[200px] shadow-sm group relative">
                    <img src="/disha-event2.jpg" alt="DISHA Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 border border-black/5 rounded-3xl" />
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="rounded-3xl overflow-hidden h-[200px] shadow-sm group relative">
                    <img src="/disha-event3.jpg" alt="DISHA Workshop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 border border-black/5 rounded-3xl" />
                  </div>
                  <div className="rounded-3xl overflow-hidden h-[300px] shadow-sm group relative">
                    <img src="/disha-event4.jpg" alt="DISHA Training" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 border border-black/5 rounded-3xl" />
                  </div>
                </div>
              </div>
              
              {/* Decorative Floating Element */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl z-10 flex items-center gap-4 border border-white/40"
              >
                <div className="bg-[#2563EB]/10 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-[#2563EB] fill-[#2563EB]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lives Touched</p>
                  <p className="text-2xl font-black text-[#0F172A]">100,000+</p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>


      {/* 9. SUCCESS STORIES */}
      <section className="py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-4">Success Stories</h2>
            <p className="text-slate-500 text-lg">Real impact from India's most dedicated student volunteers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya Sharma", role: "Taught 50+ students coding", txt: "The verified certificates helped me secure my first tech internship! The platform is incredible.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
              { name: "Rahul Verma", role: "Planted 200 trees", txt: "The XP and leaderboard system made volunteering so much fun. I logged over 200 hours this year.", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" },
              { name: "Ananya Patel", role: "Organized blood drive", txt: "Managing volunteers used to be a nightmare. DISHA's dashboard streamlined our entire process.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" }
            ].map((story, i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] p-8 rounded-[16px] shadow-sm flex flex-col relative">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-[#F97316] text-[#F97316]" />)}
                </div>
                <p className="text-slate-600 leading-relaxed mb-8 flex-1 italic">"{story.txt}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <img src={story.img} alt={story.name} className="h-12 w-12 rounded-full object-cover border border-[#E2E8F0]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">{story.name}</h4>
                    <p className="text-xs font-semibold text-[#2563EB]">{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. EVENTS & WORKSHOPS */}
      <section id="events" className="py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-4">Events & Workshops</h2>
              <p className="text-slate-500 text-lg">Join hackathons, drives, and training sessions to boost your skills.</p>
            </div>
            <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]">
              View All Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { type: "Workshop", title: "Leadership in Social Impact", date: "Aug 15, 2026", loc: "Online" },
              { type: "Hackathon", title: "Tech for Good 2026", date: "Sep 01, 2026", loc: "Bangalore" },
              { type: "Training", title: "First Aid Certification", date: "Sep 15, 2026", loc: "Delhi" },
              { type: "Volunteer Drive", title: "National Beach Cleanup", date: "Oct 05, 2026", loc: "Mumbai" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[16px] border border-[#E2E8F0] hover:border-slate-300 bg-[#F8FAFC] transition-all group gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-white border border-[#E2E8F0] flex flex-col items-center justify-center shrink-0 shadow-sm text-[#2563EB]">
                    <span className="text-[10px] font-bold uppercase">{item.date.split(' ')[0]}</span>
                    <span className="text-lg font-black leading-none">{item.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] mb-1 block">{item.type}</span>
                    <h4 className="text-base font-bold text-[#0F172A]">{item.title}</h4>
                    <p className="text-xs font-semibold text-slate-500 mt-1"><MapPin className="inline h-3 w-3 mr-1" /> {item.loc}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-bold text-[#0F172A] hover:bg-slate-50 transition-colors w-full sm:w-auto shrink-0">
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 12. PARTNERS (Expanded) */}
      <section id="partners" className="py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-12 text-[#0F172A]">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex flex-col items-center gap-3"><Building2 className="h-10 w-10 text-slate-700" /><span className="font-bold text-slate-800">Gov. Initiatives</span></div>
            <div className="flex flex-col items-center gap-3"><BookOpen className="h-10 w-10 text-slate-700" /><span className="font-bold text-slate-800">Top Universities</span></div>
            <div className="flex flex-col items-center gap-3"><Globe className="h-10 w-10 text-slate-700" /><span className="font-bold text-slate-800">Global NGOs</span></div>
            <div className="flex flex-col items-center gap-3"><Laptop className="h-10 w-10 text-slate-700" /><span className="font-bold text-slate-800">Corporate CSR</span></div>
          </div>
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-4 text-[#0F172A]">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-lg">Everything you need to know about the DISHA platform.</p>
          </div>
          
          <div className="space-y-1">
            {[
              { q: "Is DISHA completely free for students?", a: "Yes. Creating an account, applying to programs, and earning certificates is 100% free for all students." },
              { q: "How are the volunteer hours verified?", a: "NGO and campaign coordinators digitally approve your logged hours through their admin dashboard before they are added to your profile." },
              { q: "Can I use these certificates for college applications?", a: "Absolutely. Every certificate generated includes a unique cryptographic verification link that universities and employers can check." },
              { q: "How do NGOs register?", a: "NGOs can sign up for an organizational account, undergo a quick verification process, and begin posting opportunities immediately." }
            ].map((faq, i) => (
              <AccordionItem 
                key={i} 
                question={faq.q} 
                answer={faq.a} 
                isOpen={openFaq === i} 
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 14. FINAL CALL TO ACTION */}
      <section className="py-32 bg-[#2563EB] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight font-display mb-6">
            Become a Volunteer.<br/>Create Impact. Build Your Future.
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto font-medium">
            Join the fastest growing network of young change-makers in India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] bg-white px-10 py-5 text-base font-bold text-[#2563EB] transition-all hover:bg-slate-50 active:scale-[0.98] shadow-2xl">
              Register Now
            </Link>
            <a href="#programs" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] bg-transparent border-2 border-white/20 px-10 py-5 text-base font-bold text-white transition-all hover:bg-white/10 active:scale-[0.98]">
              Explore Programs
            </a>
          </div>
        </div>
      </section>

      {/* 15. FOOTER */}
      <footer id="contact" className="bg-white border-t border-[#E2E8F0] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold text-lg shadow-sm">D</span>
                <span className="font-bold text-[#0F172A] text-xl tracking-tight">DISHA FOR INDIA</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed font-medium mb-6">
                Empowering India's youth through structured volunteering, skill development, and verifiable impact.
              </p>
              {/* Newsletter Subscription */}
              <div className="flex items-center gap-2 max-w-xs">
                <input type="email" placeholder="Enter your email" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
                <button className="bg-[#0F172A] text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Subscribe</button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Home</a></li>
                <li><a href="#about" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">About Us</a></li>
                <li><a href="#programs" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Programs</a></li>
                <li><a href="#events" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Events</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Volunteer Guidelines</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">NGO Portal</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">FAQ</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Feedback</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-slate-400">
              © {new Date().getFullYear()} DISHA for India. All rights reserved. Built with ❤️ for India.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-400 hover:text-[#2563EB] transition-colors"><Globe className="h-5 w-5" /></a>
              {/* Add social icons here */}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
