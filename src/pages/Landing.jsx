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

const sectionHeaderStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const badgePop = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] } }
};

const underlineGrow = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 } }
};

const listStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } }
};

// --- REUSABLE COMPONENTS ---

const StatCounter = ({ end, suffix = "", label, theme = "light", colorClass }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 2500;
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

// ─── HERO HEADING ANIMATION ───────────────────────────────────────────
const HERO_PHRASES = [
  { highlight: "Power", rest: "to Shape Tomorrow" },
  { highlight: "Purpose", rest: "to Create Impact" },
  { highlight: "Dreams", rest: "to Transform India" },
  { highlight: "Potential", rest: "to Lead Change" },
  { highlight: "A Voice", rest: "to Inspire Millions" }
];

const AnimatedHeroHeading = ({ variants }) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const i = loopNum % HERO_PHRASES.length;
    const currentPhrase = HERO_PHRASES[i];
    const fullText = currentPhrase.highlight + " " + currentPhrase.rest;

    if (!isDeleting && text === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2500); // Pause when fully typed
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setLoopNum((prev) => prev + 1);
    } else {
      const nextDelay = isDeleting ? 60 : 120 + Math.random() * 50; // Slower delete, natural typing
      timer = setTimeout(() => {
        setText(fullText.substring(0, text.length + (isDeleting ? -1 : 1)));
      }, nextDelay);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum]);

  const currentPhrase = HERO_PHRASES[loopNum % HERO_PHRASES.length];
  const highlightLen = currentPhrase.highlight.length;
  const typedHighlight = text.substring(0, highlightLen);
  const typedRest = text.length > highlightLen ? text.substring(highlightLen) : "";

  return (
    <motion.h1 variants={variants} className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight leading-[1.2] font-display min-h-[120px] md:min-h-[100px] lg:min-h-[130px]">
      <span className="block md:inline-block md:mr-3 mb-2 md:mb-0">Everyone has</span>
      <span className="inline-block relative">
        <span className="text-[#0EA5E9]">{typedHighlight}</span>
        <span className="text-[#0F172A]">{typedRest}</span>
        <span className="animate-pulse ml-[4px] text-[#0EA5E9] font-light -translate-y-[2px] inline-block">|</span>
      </span>
    </motion.h1>
  );
};

// ─── ANIMATED PARTNER HEADING ─────────────────────────────────────────
const PARTNER_PHRASES = [
  "Trusted by Schools, Colleges & Community Partners",
  "Collaborating with Educational Institutions & NGOs",
  "Supported by Community Leaders & Partner Organizations",
  "Working Together for Social Impact"
];

const AnimatedPartnerHeading = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PARTNER_PHRASES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-8 relative overflow-hidden mb-10 flex justify-center items-center w-full">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.15em] absolute text-center w-full px-4"
        >
          {PARTNER_PHRASES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

// ─── ABOUT CARDS DATA ─────────────────────────────────────────────────
const ABOUT_CARDS = [
  {
    icon: Eye,
    iconColor: "text-[#0EA5E9]",
    iconBg: "bg-sky-50",
    accentColor: "text-[#0EA5E9]",
    borderHover: "hover:border-sky-200",
    title: "Vision",
    subtitle: "Empowering a Skilled & Progressive India",
    desc: "We envision a society where every individual has access to quality education, practical skills, and opportunities to lead a healthy, happy, and prosperous life.",
  },
  {
    icon: Target,
    iconColor: "text-[#F97316]",
    iconBg: "bg-orange-50",
    accentColor: "text-[#F97316]",
    borderHover: "hover:border-orange-200",
    title: "Mission",
    subtitle: "Building Future-Ready Youth",
    desc: "We empower students and young professionals through volunteering, mentorship, skill development, and entrepreneurship, creating leaders who drive positive social change.",
  },
  {
    icon: Flame,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    accentColor: "text-emerald-600",
    borderHover: "hover:border-emerald-200",
    title: "Passion",
    subtitle: "Inspiring Purpose-Driven Change",
    desc: "We believe in leading by example, encouraging individuals to discover their potential, contribute to society, and make a meaningful impact every day.",
  },
  {
    icon: Sparkles,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    accentColor: "text-purple-600",
    borderHover: "hover:border-purple-200",
    title: "Goal",
    subtitle: "Transforming Communities Nationwide",
    desc: "Our goal is to expand across India by connecting youth, educators, NGOs, and communities to create sustainable impact and lifelong opportunities.",
  },
];

// ─── ABOUT CAROUSEL ───────────────────────────────────────────────────
function AboutCarousel() {
  const [[current, dir], setCurrent] = useState([0, 0]);
  const total = ABOUT_CARDS.length;
  const card = ABOUT_CARDS[current];

  const paginate = (newDir) => {
    setCurrent(([c]) => [(c + newDir + total) % total, newDir]);
  };

  const goTo = (i) => setCurrent([i, i > current ? 1 : -1]);

  useEffect(() => {
    const id = setInterval(() => paginate(1), 5000);
    return () => clearInterval(id);
  });

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit:  (d) => ({ x: d > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }),
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* ── TAB NAV ─────────────────────────────────── */}
      <div className="flex items-center gap-1 mb-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-1.5">
        {ABOUT_CARDS.map((c, i) => {
          const isActive = i === current;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]"
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/60"
              }`}
            >
              <c.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? c.iconColor : "text-slate-400"}`} />
              <span className="hidden sm:block">{c.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── CARD PANEL ──────────────────────────────── */}
      <div
        className="relative flex-1 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm cursor-grab active:cursor-grabbing"
      >
        {/* Animated progress bar at the very top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-100 z-20 rounded-t-xl overflow-hidden">
          <motion.div
            key={current}
            className={`h-full ${card.iconBg.replace('bg-', 'bg-')} ${card.accentColor.replace('text-', 'bg-')}`}
            style={{ backgroundColor: undefined }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>

        {/* Left accent stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${card.activeBg ?? 'bg-[#0EA5E9]'} rounded-l-xl z-10`} />

        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={current}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) paginate(1);
              else if (info.offset.x > 40) paginate(-1);
            }}
            className="select-none h-full pl-8 pr-6 py-8"
          >
            {/* Icon + Title row */}
            <div className="flex items-start gap-4 mb-5">
              <div className={`h-13 w-13 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 p-3`}>
                <card.icon className={`h-7 w-7 ${card.iconColor}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A] leading-tight">{card.title}</h3>
                <p className={`text-xs font-bold ${card.accentColor} mt-1 uppercase tracking-widest`}>{card.subtitle}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 mb-5" />

            {/* Description */}
            <p className="text-[#64748B] text-base leading-relaxed">{card.desc}</p>

            {/* Slide counter */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium tabular-nums">{current + 1} of {total}</span>
              <span className="text-xs text-slate-400 font-medium">Swipe to explore ↔</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── PREV / NEXT BUTTONS ─────────────────────── */}
      <div className="flex items-center justify-between mt-4 px-1">
        {/* Dots */}
        <div className="flex gap-2">
          {ABOUT_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "bg-[#0EA5E9] w-7 h-2.5" : "bg-slate-200 w-2.5 h-2.5 hover:bg-sky-300"
              }`}
              aria-label={`Go to ${ABOUT_CARDS[i].title}`}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => paginate(-1)}
            className="h-9 w-9 rounded-lg bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#64748B] hover:text-[#0EA5E9] hover:border-sky-200 hover:bg-sky-50 transition-all"
            aria-label="Previous"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => paginate(1)}
            className="h-9 w-9 rounded-lg bg-[#0EA5E9] border border-[#0EA5E9] shadow-sm flex items-center justify-center text-white hover:bg-[#0284C7] transition-all"
            aria-label="Next"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FEATURES DATA ────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Search,
    iconColor: "text-[#0EA5E9]",
    iconBg: "bg-sky-50",
    activeBg: "bg-sky-500",
    title: "Meaningful Volunteering",
    desc: "Engage in purpose-driven campaigns across education, healthcare, and sustainability to create measurable, real-world impact.",
  },
  {
    icon: BookOpenCheck,
    iconColor: "text-[#F97316]",
    iconBg: "bg-orange-50",
    activeBg: "bg-orange-500",
    title: "Practical Skill Building",
    desc: "Cultivate essential competencies in leadership, communication, and project management through hands-on experience and expert mentorship.",
  },
  {
    icon: Target,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    activeBg: "bg-emerald-500",
    title: "Empowered Leadership",
    desc: "Spearhead grassroots initiatives, coordinate volunteer cohorts, and execute high-impact projects that drive lasting social change.",
  },
  {
    icon: LineChart,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    activeBg: "bg-purple-500",
    title: "Accelerated Career Growth",
    desc: "Fortify your professional portfolio with demonstrable social impact, distinguishing yourself for top-tier internships and higher education.",
  },
  {
    icon: Award,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    activeBg: "bg-rose-500",
    title: "Verified Certification",
    desc: "Earn officially recognized credentials that validate your dedication, leadership, and tangible contributions to the community.",
  },
  {
    icon: Globe,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    activeBg: "bg-indigo-500",
    title: "Sustainable Impact",
    desc: "Play a pivotal role in scalable initiatives designed to uplift marginalized groups, democratize education, and build resilient societies.",
  },
];

// ─── FEATURE ACCORDION ────────────────────────────────────────────────
function FeatureAccordion() {
  const [active, setActive] = useState(null);

  return (
    <div className="lg:w-1/2">
      {/* Header — animated */}
      <motion.div
        variants={sectionHeaderStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mb-8"
      >
        {/* Badge with pop + ring pulse */}
        <motion.span
          variants={badgePop}
          className="relative inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#F97316] bg-orange-50 border border-orange-100 rounded-full px-4 py-2 mb-6"
        >
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-orange-300/60"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 1.55, opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", repeatDelay: 0.6 }}
          />
          Why Choose Us
        </motion.span>

        {/* Heading with animated gradient underline */}
        <motion.div variants={slideUp} className="mb-1">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-1">
            Why Choose Disha For India?
          </h2>
          <motion.span
            variants={underlineGrow}
            style={{ originX: 0 }}
            className="block h-1 rounded-full bg-gradient-to-r from-orange-300 via-[#F97316] to-amber-400 mb-4"
          />
        </motion.div>

        <motion.p variants={slideUp} className="text-[#64748B] text-lg leading-relaxed">
          Empowering individuals to create meaningful social impact through volunteering, leadership, and community engagement.
        </motion.p>
      </motion.div>

      {/* Clickable Items — swipe-in on scroll */}
      <div className="space-y-2">
        {FEATURES.map((f, i) => {
          const isOpen = active === i;
          const fromLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: fromLeft ? -80 : 80, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: fromLeft ? 6 : -6, transition: { duration: 0.2 } }}
            >
              {/* Row – click to toggle */}
              <button
                onClick={() => setActive(isOpen ? null : i)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isOpen
                    ? "bg-white border border-[#E2E8F0] shadow-sm"
                    : "hover:bg-white hover:border hover:border-[#E2E8F0] hover:shadow-sm border border-transparent"
                  }`}
              >
                {/* Icon */}
                <div className={`h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors duration-200
                  ${isOpen ? f.activeBg : f.iconBg}`}>
                  <f.icon className={`h-5 w-5 ${isOpen ? "text-white" : f.iconColor}`} />
                </div>

                {/* Title */}
                <span className={`flex-1 text-left text-sm font-semibold transition-colors duration-200
                  ${isOpen ? "text-[#0F172A]" : "text-[#0F172A] group-hover:text-[#0EA5E9]"}`}>
                  {f.title}
                </span>

                {/* Chevron */}
                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className={`h-4 w-4 flex-shrink-0 transition-colors ${isOpen ? "text-[#0EA5E9]" : "text-slate-400"}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Expanded Description Card */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mx-2 mb-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-5 py-4">
                      <p className="text-sm text-[#64748B] leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

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
    <section className="bg-white border-b border-[#E2E8F0] overflow-hidden">

      {/* ── PROFESSIONAL LIGHT HEADER ── */}
      <div className="relative overflow-hidden">

        {/* Soft background glow — centered */}
        <div
          className="absolute inset-x-0 top-0 h-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(14,165,233,0.07) 0%, transparent 70%)" }}
        />

        <div className="max-w-3xl mx-auto px-6 pt-20 pb-14 text-center relative z-10">
          <motion.div
            variants={sectionHeaderStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col items-center"
          >

            {/* Badge */}
            <motion.span
              variants={badgePop}
              className="relative inline-flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-full px-4 py-1.5 text-[11px] font-bold text-[#0EA5E9] uppercase tracking-widest mb-6"
            >
              <motion.span
                className="absolute inset-0 rounded-full border border-[#0EA5E9]/30"
                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              Our Testimonials
            </motion.span>

            {/* Headline */}
            <motion.div variants={slideUp}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0F172A] leading-[1.15] mb-2">
                What they are{" "}
                <span className="relative inline-block">
                  {/* Highlight background chip */}
                  <span className="relative z-10 text-[#0EA5E9]">talking</span>
                  <motion.span
                    className="absolute inset-x-0 bottom-0 h-[38%] bg-sky-100 rounded-md -z-0"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>{" "}
                about
              </h2>
            </motion.div>

            {/* Animated underline */}
            <motion.span
              variants={underlineGrow}
              style={{ originX: 0.5 }}
              className="block h-[3px] w-16 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 mt-4 mb-5"
            />

            {/* Subtext */}
            <motion.p variants={slideUp} className="text-slate-400 text-sm font-medium tracking-widest uppercase">
              Disha For India
            </motion.p>

          </motion.div>
        </div>
      </div>

      {/* ── CAROUSEL BELOW ── */}
      <div className="max-w-4xl mx-auto px-6 py-16">

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

              <AnimatedHeroHeading variants={fadeUp} />
              
              <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Be a Volunteer with Disha For India. Invest your time, uplift lives, and build a better India — one community at a time.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link to="/register" className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#0EA5E9] px-8 py-4 text-sm font-bold text-white transition-all hover:bg-[#0284C7] hover:shadow-lg hover:shadow-sky-500/20 shadow-sm relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Be a Volunteer with Disha
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    {/* Hover sweep effect */}
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <a href="#programs" className="w-full sm:w-auto inline-flex items-center justify-center rounded-[12px] bg-white border border-[#E2E8F0] px-8 py-4 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC] hover:border-slate-300 transition-all shadow-sm hover:shadow-md">
                    Explore Programs
                  </a>
                </motion.div>
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

          {/* Section Header — animated */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={sectionHeaderStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* Badge with pop + ring pulse */}
            <motion.span
              variants={badgePop}
              className="relative inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#0EA5E9] bg-sky-50 border border-sky-100 rounded-full px-4 py-2 mb-5"
            >
              {/* Animated ring */}
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-sky-300/60"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.55, opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", repeatDelay: 0.6 }}
              />
              Our Story
            </motion.span>

            {/* Heading with animated gradient underline */}
            <motion.div variants={slideUp} className="relative inline-block">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-1">About DISHA</h2>
              <motion.span
                variants={underlineGrow}
                style={{ originX: 0.5 }}
                className="block h-1 rounded-full bg-gradient-to-r from-sky-300 via-[#0EA5E9] to-indigo-400 mt-1 mb-4"
              />
            </motion.div>

            <motion.p variants={slideUp} className="text-slate-500 text-lg font-medium">
              Empowering India's youth through volunteering, leadership, skill development, and community impact.
            </motion.p>
          </motion.div>

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


            {/* RIGHT: Swipe Carousel */}
            <AboutCarousel />
          </div>


          {/* Quote Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0F172A] rounded-[24px] p-12 text-center text-white flex flex-col items-center relative overflow-hidden"
          >
            {/* Subtle glow behind */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(14,165,233,0.12) 0%, transparent 70%)" }}
            />

            {/* Animated quote mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: -10 }}
              whileInView={{ opacity: 0.3, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="text-5xl mb-4 font-serif leading-none text-[#0EA5E9]"
            >
              "
            </motion.div>

            {/* Word-by-word animated quote */}
            <motion.p
              className="text-2xl md:text-3xl font-bold font-display leading-snug italic max-w-3xl mx-auto relative z-10"
              variants={sectionHeaderStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                { word: "Together", highlight: false },
                { word: "we", highlight: false },
                { word: "learn,", highlight: true },
                { word: "together", highlight: false },
                { word: "we", highlight: false },
                { word: "lead,", highlight: true },
                { word: "together", highlight: false },
                { word: "we", highlight: false },
                { word: "build", highlight: true },
                { word: "a", highlight: true },
                { word: "better", highlight: true },
                { word: "India.", highlight: true },
              ].map(({ word, highlight }, i) => (
                <motion.span
                  key={i}
                  variants={slideUp}
                  className={`inline-block mr-[0.25em] ${highlight ? "bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent" : "text-white"}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            {/* Author */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex flex-col items-center gap-2 relative z-10"
            >
              <motion.span
                className="block h-px w-10 bg-gradient-to-r from-sky-400 to-indigo-400"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                style={{ originX: 0.5 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              />
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">— Disha For India</p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 3. IMPACT & PARTNERS (Ultra-Minimal Professional) */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Partners Row - Infinite Swipe Marquee */}
          <div className="mb-24 text-center">
            <AnimatedPartnerHeading />
            <div className="relative w-full overflow-hidden flex items-center">
              {/* Left/Right fading edges for smooth enter/exit */}
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <motion.div
                className="flex w-max items-center opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700 text-slate-500"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              >
                {/* First Set */}
                <div className="flex items-center gap-12 md:gap-24 pr-12 md:pr-24">
                  <div className="flex items-center gap-2 text-lg font-black"><Building2 className="h-6 w-6" /> Gov Partners</div>
                  <div className="flex items-center gap-2 text-lg font-black"><BookOpen className="h-6 w-6" /> State Univ</div>
                  <div className="flex items-center gap-2 text-lg font-black"><Globe className="h-6 w-6" /> Global NGO</div>
                  <div className="flex items-center gap-2 text-lg font-black"><Users className="h-6 w-6" /> India Cares</div>
                  <div className="flex items-center gap-2 text-lg font-black"><Laptop className="h-6 w-6" /> Tech CSR</div>
                </div>
                {/* Second Set (Duplicate for seamless loop) */}
                <div className="flex items-center gap-12 md:gap-24 pr-12 md:pr-24">
                  <div className="flex items-center gap-2 text-lg font-black"><Building2 className="h-6 w-6" /> Gov Partners</div>
                  <div className="flex items-center gap-2 text-lg font-black"><BookOpen className="h-6 w-6" /> State Univ</div>
                  <div className="flex items-center gap-2 text-lg font-black"><Globe className="h-6 w-6" /> Global NGO</div>
                  <div className="flex items-center gap-2 text-lg font-black"><Users className="h-6 w-6" /> India Cares</div>
                  <div className="flex items-center gap-2 text-lg font-black"><Laptop className="h-6 w-6" /> Tech CSR</div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="w-full max-w-4xl mx-auto h-px bg-slate-100 mb-24"></div>

          {/* Minimal Stats Grid with Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-4">
            {[
              { end: 10, suffix: "K+", label: "Healthcare Impact" },
              { end: 500, suffix: "+", label: "Schools Covered" },
              { end: 100, suffix: "K+", label: "People Trained" },
              { end: 5, suffix: "K+", label: "Financial Literacy" },
              { end: 5, suffix: "K+", label: "Community Development" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="text-center group relative p-6 rounded-2xl cursor-default"
              >
                {/* Animated Highlight Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-50/80 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <StatCounter 
                    end={stat.end} 
                    suffix={stat.suffix} 
                    label={stat.label} 
                    theme="minimal" 
                    colorClass="text-[#0F172A] group-hover:bg-gradient-to-r group-hover:from-[#0EA5E9] group-hover:to-indigo-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300" 
                  />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. WHY CHOOSE DISHA (Asymmetric Layout) */}
      <section className="py-24 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Left: Clickable Feature Points */}
            <FeatureAccordion />

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








      {/* 14. FINAL CALL TO ACTION — Premium Redesign */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[32px] overflow-hidden shadow-2xl bg-slate-50 border border-[#E2E8F0]"
          >
            {/* ── Animated floating orbs ── */}
            <motion.div
              className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />

            {/* ── Grid lines decoration ── */}
            <div className="absolute inset-0 opacity-[0.3] pointer-events-none"
              style={{ backgroundImage: "linear-gradient(rgba(14,165,233,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
            />

            {/* ── Main Content ── */}
            <div className="relative z-10 py-24 px-6 text-center max-w-4xl mx-auto">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-sky-100/80 border border-sky-200 rounded-full px-4 py-2 mb-8 backdrop-blur-sm"
              >
                <motion.span
                  className="h-2 w-2 rounded-full bg-[#0EA5E9]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] sm:text-xs font-bold text-[#0EA5E9] uppercase tracking-widest">Join 10,000+ Volunteers Across India</span>
              </motion.div>

              {/* Headline — word by word */}
              <motion.h2
                className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-6 leading-[1.1]"
                variants={sectionHeaderStagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {["Become", "a", "Volunteer."].map((word, i) => (
                  <motion.span key={i} variants={slideUp} className="inline-block mr-3 text-[#0F172A]">{word}</motion.span>
                ))}
                <br />
                {["Create"].map((word, i) => (
                  <motion.span key={i} variants={slideUp} className="inline-block mr-3 text-[#0F172A]">{word}</motion.span>
                ))}
                <motion.span
                  variants={slideUp}
                  className="inline-block mr-3 relative"
                >
                  <span className="relative z-10 bg-gradient-to-r from-[#0EA5E9] to-indigo-500 bg-clip-text text-transparent">
                    Impact.
                  </span>
                  {/* shimmer sweep */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  />
                </motion.span>
                {["Build", "Your", "Future."].map((word, i) => (
                  <motion.span key={i} variants={slideUp} className="inline-block mr-3 text-[#0F172A]">{word}</motion.span>
                ))}
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="text-slate-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
              >
                Join the fastest growing network of young change-makers in India.
                Elevate your skills and transform communities today.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
              >
                {/* Primary — glowing */}
                <div className="relative group w-full sm:w-auto">
                  <motion.span
                    className="absolute inset-0 rounded-xl bg-[#0EA5E9]/30 blur-md transition-opacity duration-300 group-hover:bg-[#0EA5E9]/50"
                  />
                  <Link
                    to="/register"
                    className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#0EA5E9] px-10 py-4 text-base font-bold text-white transition-all hover:bg-[#0284C7] active:scale-[0.98] shadow-lg shadow-sky-500/20"
                  >
                    Register Now <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Secondary — ghost */}
                <a
                  href="#programs"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E2E8F0] px-10 py-4 text-base font-bold text-[#0F172A] transition-all hover:bg-slate-50 active:scale-[0.98] shadow-sm hover:shadow"
                >
                  Explore Programs
                </a>
              </motion.div>

              {/* Floating stat chips */}
              <motion.div
                className="flex flex-wrap justify-center gap-4"
                variants={sectionHeaderStagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {[
                  { value: "10,000+", label: "Volunteers" },
                  { value: "50+", label: "Cities" },
                  { value: "1,00,000+", label: "Lives Touched" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    variants={slideUp}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-full px-5 py-2.5 shadow-sm transition-shadow hover:shadow-md cursor-default"
                  >
                    <span className="text-sm font-black text-[#0F172A]">{stat.value}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* 15. FOOTER */}
      <Footer />

    </div>
  );
}
