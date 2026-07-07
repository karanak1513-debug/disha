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

const StatCounter = ({ end, suffix = "", label }) => {
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

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm">
      <div className="text-3xl md:text-4xl font-black text-[#0F172A] mb-2 font-display">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest text-center">{label}</div>
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

      {/* 3. TRUSTED BY LOGOS (Right below Hero) */}
      <section className="py-10 bg-white border-b border-[#E2E8F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by leading organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Using icons as logo stand-ins */}
            <div className="flex items-center gap-2 text-lg font-black"><Building2 className="h-6 w-6" /> Gov Partners</div>
            <div className="flex items-center gap-2 text-lg font-black"><BookOpen className="h-6 w-6" /> State Univ</div>
            <div className="flex items-center gap-2 text-lg font-black"><Globe className="h-6 w-6" /> Global NGO</div>
            <div className="flex items-center gap-2 text-lg font-black"><Users className="h-6 w-6" /> India Cares</div>
            <div className="flex items-center gap-2 text-lg font-black"><Laptop className="h-6 w-6" /> Tech CSR</div>
          </div>
        </div>
      </section>

      {/* 4. IMPACT STATISTICS */}
      <section className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCounter end={10000} suffix="+" label="Healthcare Impact" />
            <StatCounter end={500} suffix="+" label="Schools Covered" />
            <StatCounter end={100000} suffix="+" label="People Trained" />
            <StatCounter end={5000} suffix="+" label="Financial Literacy" />
            <StatCounter end={5000} suffix="+" label="Community Development" />
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

      {/* 6. WHY CHOOSE DISHA (9 Features) */}
      <section className="py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F97316] bg-orange-50 border border-orange-100 rounded-full px-4 py-2 mb-4">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display text-[#0F172A] mb-4">Why Choose Disha For India?</h2>
            <p className="text-slate-500 text-lg leading-relaxed">Empowering individuals to create meaningful social impact through volunteering, leadership, and community engagement.</p>
          </div>

          {/* Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                number: "01",
                iconColor: "text-[#2563EB]",
                iconBg: "bg-blue-50",
                borderHover: "hover:border-blue-200",
                title: "Volunteer Opportunities",
                desc: "Join impactful campaigns in education, environmental sustainability, healthcare, and community development.",
                colSpan: "md:col-span-1",
                rowSpan: "md:row-span-2",
                img: "/disha-event1.jpg",
                imgPos: "top",
              },
              {
                icon: BookOpenCheck,
                number: "02",
                iconColor: "text-[#F97316]",
                iconBg: "bg-orange-50",
                borderHover: "hover:border-orange-200",
                title: "Skill Development",
                desc: "Enhance your communication, leadership, teamwork, and project management skills through practical volunteering experiences and mentorship.",
                colSpan: "md:col-span-2",
                img: "/disha-event2.jpg",
                imgPos: "right",
              },
              {
                icon: Target,
                number: "03",
                iconColor: "text-emerald-600",
                iconBg: "bg-emerald-50",
                borderHover: "hover:border-emerald-200",
                title: "Leadership",
                desc: "Lead initiatives, coordinate volunteers, and drive projects that create lasting change while developing confidence.",
                colSpan: "md:col-span-1",
              },
              {
                icon: LineChart,
                number: "04",
                iconColor: "text-purple-600",
                iconBg: "bg-purple-50",
                borderHover: "hover:border-purple-200",
                title: "Career Growth",
                desc: "Build a strong profile with real-world social impact experience, making you stand out for higher education and internships.",
                colSpan: "md:col-span-1",
              },
              {
                icon: Award,
                number: "05",
                iconColor: "text-rose-500",
                iconBg: "bg-rose-50",
                borderHover: "hover:border-rose-200",
                title: "Verified Certificates",
                desc: "Receive recognized certificates for your participation and contribution, showcasing your commitment to community service.",
                colSpan: "md:col-span-2",
                img: "/disha-event3.jpg",
                imgPos: "left",
              },
              {
                icon: Globe,
                number: "06",
                iconColor: "text-white",
                iconBg: "bg-white/20 backdrop-blur-md border border-white/20",
                borderHover: "border-transparent",
                title: "Community Impact",
                desc: "Contribute to initiatives that improve education, empower communities, and support sustainable development across India.",
                colSpan: "md:col-span-1",
                img: "/disha-event4.jpg",
                imgPos: "bg",
                isDark: true
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`group bg-white border border-[#E2E8F0] ${f.borderHover} hover:shadow-xl transition-all duration-300 rounded-[32px] relative overflow-hidden flex ${
                  f.imgPos === "right" ? "flex-col md:flex-row-reverse" : 
                  f.imgPos === "left" ? "flex-col md:flex-row" : 
                  "flex-col"
                } ${f.colSpan || ""} ${f.rowSpan || ""}`}
              >
                {f.imgPos === "bg" ? (
                  <>
                    <div className="absolute inset-0 z-0">
                      <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-slate-900/70 group-hover:bg-slate-900/60 transition-colors duration-500" />
                    </div>
                    <div className={`p-8 md:p-10 flex-1 flex flex-col justify-end relative z-10 h-full min-h-[320px]`}>
                      <span className="absolute top-6 right-6 text-xs font-black text-white/20 tracking-widest font-display">{f.number}</span>
                      <div className={`h-14 w-14 rounded-2xl ${f.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <f.icon className={`h-7 w-7 ${f.iconColor}`} />
                      </div>
                      <h4 className="text-xl font-black text-white mb-3">{f.title}</h4>
                      <p className="text-sm text-slate-200 leading-relaxed font-medium">{f.desc}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {f.img && (
                      <div className={`relative overflow-hidden shrink-0 ${
                        f.imgPos === "right" || f.imgPos === "left" ? "w-full md:w-[45%]" : "w-full h-56 md:h-1/2 min-h-[220px]"
                      }`}>
                        <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}

                    <div className={`p-8 md:p-10 flex-1 flex flex-col justify-center relative`}>
                      <span className="absolute top-6 right-6 text-xs font-black text-slate-200 tracking-widest font-display">{f.number}</span>
                      <div className={`h-14 w-14 rounded-2xl ${f.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <f.icon className={`h-7 w-7 ${f.iconColor}`} />
                      </div>
                      <h4 className="text-xl font-black text-[#0F172A] mb-3">{f.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. HOW DISHA WORKS */}
      <section id="how-it-works" className="py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-4">How DISHA Works</h2>
            <p className="text-slate-500 text-lg">A frictionless pipeline from registration to career growth.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-start gap-4 relative">
            {/* Desktop Timeline Line */}
            <div className="hidden lg:block absolute top-10 left-[5%] right-[5%] h-[2px] bg-[#E2E8F0] z-0" />
            
            {[
              "Register", "Complete Profile", "Choose Program", "Volunteer", "Track Progress", "Earn Certificate", "Build Career"
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center flex-1 w-full group mb-8 lg:mb-0">
                <div className="h-20 w-20 rounded-full bg-white border-[3px] border-[#E2E8F0] flex items-center justify-center mb-4 group-hover:border-[#2563EB] group-hover:shadow-lg transition-all duration-300">
                  <span className="text-xl font-black text-slate-300 group-hover:text-[#2563EB] transition-colors">{i + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-[#0F172A] leading-tight">{step}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FEATURED PROGRAMS */}
      <section id="programs" className="py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-4">Featured Volunteer Programs</h2>
              <p className="text-slate-500 text-lg">High-impact opportunities curated for ambitious students.</p>
            </div>
            <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8]">
              View All Programs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Digital Literacy Drive", cat: "Education", dur: "3 Months", loc: "Mumbai", seats: "12/50", mentor: "Dr. Sharma", diff: "Beginner", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800" },
              { title: "Urban Reforestation", cat: "Environment", dur: "4 Weeks", loc: "Delhi", seats: "5/20", mentor: "Anita Desai", diff: "Intermediate", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" },
              { title: "Youth Mentorship", cat: "Community", dur: "6 Months", loc: "Remote", seats: "40/100", mentor: "Raj Patel", diff: "Advanced", img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=800" }
            ].map((prog, i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group">
                <div className="h-48 overflow-hidden relative">
                  <img src={prog.img} alt={prog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-800 shadow-sm">{prog.cat}</div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[#0F172A] mb-4">{prog.title}</h3>
                  <div className="grid grid-cols-2 gap-y-3 mb-6">
                    <div className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Duration:</span> {prog.dur}</div>
                    <div className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Location:</span> {prog.loc}</div>
                    <div className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Seats:</span> {prog.seats}</div>
                    <div className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Mentor:</span> {prog.mentor}</div>
                    <div className="text-xs text-slate-500 col-span-2"><span className="font-semibold text-slate-700">Difficulty:</span> {prog.diff}</div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#E2E8F0]">
                    <Link to="/register" className="w-full inline-flex items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#E2E8F0] text-[#0F172A] text-sm font-bold py-3 rounded-lg transition-colors">
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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

      {/* 11. COMMUNITY IMPACT */}
      <section id="impact" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="flex-1">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#F97316] bg-orange-50 border border-orange-100 rounded-full px-4 py-2 mb-6">
                Our Impact
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-display text-[#0F172A] mb-6">
                Real People.<br />Measurable Change.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Through our dedicated volunteers and comprehensive programs, DISHA is transforming lives across India. From educational workshops to environmental drives, every action builds a stronger, more capable society.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB]">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0F172A]">Community Empowerment</h4>
                    <p className="text-slate-500 mt-1">Bringing people together to solve local challenges and build sustainable support networks.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316]">
                    <BookOpenCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#0F172A]">Skill Transformation</h4>
                    <p className="text-slate-500 mt-1">Equipping the youth with practical knowledge to lead, innovate, and drive tomorrow's economy.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Modern 4-Image Grid */}
            <div className="flex-1 w-full relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden h-64 shadow-sm group">
                    <img src="/disha-event1.jpg" alt="DISHA Seminar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-40 shadow-sm group">
                    <img src="/disha-event2.jpg" alt="DISHA Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden h-40 shadow-sm group">
                    <img src="/disha-event3.jpg" alt="DISHA Workshop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="rounded-2xl overflow-hidden h-64 shadow-sm group">
                    <img src="/disha-event4.jpg" alt="DISHA Training" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
              </div>
              
              {/* Decorative Floating Element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl z-10 flex items-center gap-3 animate-pulse-slow border border-slate-100">
                <div className="bg-green-100 p-2 rounded-full">
                  <Heart className="h-6 w-6 text-green-600 fill-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lives Touched</p>
                  <p className="text-xl font-black text-[#0F172A]">100,000+</p>
                </div>
              </div>
            </div>

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
