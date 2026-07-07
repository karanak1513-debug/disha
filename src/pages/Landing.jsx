import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/public/PublicNavbar";
import Footer from "../components/public/Footer";
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
  
  const containerClasses = theme === 'minimal' || theme === 'dark'
    ? 'flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center p-6 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm';

  return (
    <div className={containerClasses}>
      <div className={`text-4xl md:text-5xl font-black mb-2 font-display ${textColor}`}>
        {count.toLocaleString()}{suffix}
      </div>
      {label && <div className={`text-xs font-bold uppercase tracking-widest text-center mt-1 ${labelColor}`}>{label}</div>}
    </div>
  );
};

// ─── TESTIMONIALS DATA ───────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Jaswinder Singh",
    quote: "I am associated with NGO for last 5 years, they are doing a great work by uplifting lives of youth.",
    initials: "JS",
    color: "bg-[#0EA5E9]",
  },
  {
    name: "Neeru Garg",
    quote: "I know Indu for last 10 years and she is a very powerful personality.",
    initials: "NG",
    color: "bg-[#6366F1]",
  },
  {
    name: "Mandeep Singh",
    quote: "I attended the \"Break the limits\" event — it really changed my perception about life and success.",
    initials: "MS",
    color: "bg-[#10B981]",
  },
];

// ─── TESTIMONIALS CAROUSEL ────────────────────────────────────────────
function TestimonialsCarousel() {
  const [[current, dir], setCurrent] = useState([0, 0]);
  const total = TESTIMONIALS.length;

  const paginate = (newDir) => {
    setCurrent(([c]) => [(c + newDir + total) % total, newDir]);
  };

  // Auto-play every 4 s
  useEffect(() => {
    const id = setInterval(() => paginate(1), 4000);
    return () => clearInterval(id);
  });

  const variants = {
    enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
  };

  const t = TESTIMONIALS[current];

  return (
    <section className="py-24 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-100 rounded-full px-4 py-1.5 text-xs font-bold text-[#0EA5E9] uppercase tracking-widest mb-5">
            Our Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 text-[#0F172A]">
            What they are talking about
          </h2>
          <p className="text-[#64748B] text-base font-medium">Disha For India</p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Animated Card */}
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence initial={false} custom={dir} mode="wait">
              <motion.div
                key={current}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) paginate(1);
                  else if (info.offset.x > 60) paginate(-1);
                }}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-10 md:p-14 shadow-sm cursor-grab active:cursor-grabbing select-none"
              >
                {/* Big quote mark */}
                <div className="text-7xl leading-none text-[#0EA5E9] opacity-15 font-serif mb-4 select-none">"</div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-[#F97316] text-[#F97316]" />)}
                </div>

                {/* Quote */}
                <p className="text-[#0F172A] text-xl md:text-2xl font-medium leading-relaxed mb-10">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-full ${t.color} flex items-center justify-center text-white text-base font-bold shadow-md flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0F172A]">{t.name}</h4>
                    <p className="text-sm text-[#0EA5E9] font-semibold mt-0.5">Disha For India</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next Buttons */}
          <button
            onClick={() => paginate(-1)}
            className="absolute -left-5 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white border border-[#E2E8F0] shadow-md flex items-center justify-center text-[#0F172A] hover:bg-sky-50 hover:border-sky-200 hover:text-[#0EA5E9] transition-all z-10"
            aria-label="Previous"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute -right-5 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white border border-[#E2E8F0] shadow-md flex items-center justify-center text-[#0F172A] hover:bg-sky-50 hover:border-sky-200 hover:text-[#0EA5E9] transition-all z-10"
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2.5 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent([i, i > current ? 1 : -1])}
              className={`transition-all duration-300 rounded-full ${i === current ? 'bg-[#0EA5E9] w-7 h-2.5' : 'bg-slate-300 w-2.5 h-2.5 hover:bg-sky-300'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Swipe hint */}
        <p className="text-center text-xs text-slate-400 mt-4 font-medium">Swipe or drag to navigate</p>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#0EA5E9] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      
      {/* 1. STICKY HEADER */}
      <PublicNavbar />

      {/* 2. HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white border-b border-[#E2E8F0]">
        {/* Soft Background Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
          <div className="w-full max-w-7xl relative">
            <div className="absolute -top-24 right-0 w-[600px] h-[600px] bg-sky-50/50 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div initial="hidden" animate="show" variants={stagger} className="flex-1 space-y-8 text-center lg:text-left">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-full px-4 py-2 text-xs font-bold text-[#0EA5E9] uppercase tracking-widest">
                <Sparkles className="h-3 w-3" /> WE EMPOWER | WE MAKE THE DIFFERENCE
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold text-[#0F172A] tracking-tight leading-[1.1] font-display">
                Everyone has <span className="text-[#0EA5E9]">Power</span> to create an Impact
              </motion.h1>
              
              <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Be a Volunteer with Disha For India. Invest your time, uplift lives, and build a better India — one community at a time.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#0EA5E9] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#0284C7] active:scale-[0.98] shadow-sm">
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
                  <p className="text-[10px] font-bold text-[#0EA5E9] mt-1 uppercase tracking-widest">— Nelson Mandela</p>
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
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0EA5E9] bg-sky-50 border border-sky-100 rounded-full px-4 py-2 mb-4">Our Story</span>
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
                <div className="absolute -bottom-5 -right-5 bg-[#0EA5E9] text-white rounded-[16px] p-5 shadow-2xl">
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
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-8 rounded-[20px] hover:border-sky-200 hover:shadow-lg transition-all group">
                <div className="h-12 w-12 rounded-[12px] bg-sky-50 flex items-center justify-center mb-5 group-hover:bg-sky-100 transition-colors">
                  <Eye className="h-6 w-6 text-[#0EA5E9]" />
                </div>
                <h3 className="text-lg font-black text-[#0F172A] mb-1">Vision</h3>
                <p className="text-xs font-bold text-[#0EA5E9] mb-3 uppercase tracking-widest">Empowering a Skilled & Progressive India</p>
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

      {/* 3. IMPACT & PARTNERS (Ultra-Minimal Professional) */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Partners Row */}
          <div className="mb-24 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">Trusted by Leading Organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700 text-slate-500">
              <div className="flex items-center gap-2 text-lg font-black"><Building2 className="h-6 w-6" /> Gov Partners</div>
              <div className="flex items-center gap-2 text-lg font-black"><BookOpen className="h-6 w-6" /> State Univ</div>
              <div className="flex items-center gap-2 text-lg font-black"><Globe className="h-6 w-6" /> Global NGO</div>
              <div className="flex items-center gap-2 text-lg font-black"><Users className="h-6 w-6" /> India Cares</div>
              <div className="flex items-center gap-2 text-lg font-black"><Laptop className="h-6 w-6" /> Tech CSR</div>
            </div>
          </div>

          <div className="w-full max-w-4xl mx-auto h-px bg-slate-100 mb-24"></div>

          {/* Minimal Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-16 gap-x-8">
            {[
              { end: 10000, suffix: "+", label: "Healthcare Impact" },
              { end: 500, suffix: "+", label: "Schools Covered" },
              { end: 100000, suffix: "+", label: "People Trained" },
              { end: 5000, suffix: "+", label: "Financial Literacy" },
              { end: 5000, suffix: "+", label: "Community Development" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <StatCounter end={stat.end} suffix={stat.suffix} label={stat.label} theme="minimal" colorClass="text-[#0F172A]" />
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
                    iconColor: "text-[#0EA5E9]",
                    iconBg: "bg-sky-50",
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
                <div className="bg-[#0EA5E9]/10 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-[#0EA5E9] fill-[#0EA5E9]" />
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


      {/* 9. TESTIMONIALS CAROUSEL */}
      <TestimonialsCarousel />








      {/* 14. FINAL CALL TO ACTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="bg-[#0F172A] rounded-[32px] overflow-hidden relative shadow-2xl">
            {/* Dark background elements */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
            
            <div className="relative z-10 py-24 px-6 text-center max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight font-display mb-6 leading-tight">
                Become a Volunteer.<br />Create Impact. Build Your Future.
              </h2>
              <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
                Join the fastest growing network of young change-makers in India. Elevate your skills and transform communities today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-10 py-5 text-base font-bold text-[#0F172A] transition-all hover:bg-slate-100 active:scale-[0.98] shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]">
                  Register Now <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#programs" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-10 py-5 text-base font-bold text-white transition-all hover:bg-white/10 active:scale-[0.98] backdrop-blur-sm">
                  Explore Programs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. FOOTER */}
      <Footer />

    </div>
  );
}
