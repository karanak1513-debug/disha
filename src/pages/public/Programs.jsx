import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Globe, BookOpen, Leaf, Heart, Activity,
  Users, Clock, Zap, MapPin, Calendar, ArrowUpRight
} from "lucide-react";

/* ─── Animation presets ─────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

/* ─── Category config ────────────────────────────────────────────── */
const CATS = {
  All: { icon: Globe, grad: "from-slate-700 to-slate-900", pill: "bg-slate-900 text-white" },
  Education: { icon: BookOpen, grad: "from-violet-600 to-purple-800", pill: "bg-violet-600 text-white" },
  Environment: { icon: Leaf, grad: "from-emerald-600 to-teal-800", pill: "bg-emerald-600 text-white" },
  "Social Relief": { icon: Heart, grad: "from-rose-600 to-pink-800", pill: "bg-rose-600 text-white" },
  Health: { icon: Activity, grad: "from-orange-500 to-amber-700", pill: "bg-orange-500 text-white" },
};

/* ─── Subcomponents ─────────────────────────────────────────────── */
function FillBar({ registered = 0, limit = 1 }) {
  const pct = Math.min((registered / limit) * 100, 100);
  const full = registered >= limit;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold text-slate-400">
        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {registered}/{limit} spots</span>
        <span className={full ? "text-rose-500" : "text-slate-400"}>{full ? "Full" : Math.round(pct) + "% filled"}</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${full ? "bg-rose-400" : "bg-gradient-to-r from-blue-500 to-cyan-400"}`}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
        />
      </div>
    </div>
  );
}

function ProgramCard({ prog }) {
  const cfg = CATS[prog.category] || CATS.All;
  const Icon = cfg.icon;
  const isFull = (prog.registeredCount || 0) >= prog.volunteerLimit;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.06)" }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 transition-all"
    >
      {/* ── Compact Header Image ── */}
      <div className="relative h-32 overflow-hidden bg-slate-100 flex-shrink-0">
        {prog.bannerURL ? (
          <img src={prog.bannerURL} alt={prog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cfg.grad} relative flex items-center justify-center`}>
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.1) 1px,transparent 1px)", backgroundSize: "16px 16px" }} />
            <Icon className="h-10 w-10 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${cfg.pill} shadow-sm`}>
            <Icon className="h-2 w-2" /> {prog.category}
          </span>
          {isFull && <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-rose-500 text-white shadow-sm uppercase tracking-wider">FULL</span>}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title & Description */}
        <div className="mb-4 flex-1">
          <h3 className="font-bold text-slate-800 text-[15px] leading-snug line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">{prog.title}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{prog.description}</p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600">
            <Clock className="h-3 w-3 text-slate-400" /> {prog.hours} Hrs
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-700">
            <Zap className="h-3 w-3 text-amber-500" /> +{prog.xp} XP
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 mb-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{prog.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{prog.deadline}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <FillBar registered={prog.registeredCount || 0} limit={prog.volunteerLimit} />
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {isFull ? (
            <div className="flex items-center justify-center w-full py-2 rounded-xl bg-slate-100 text-[11px] font-bold text-slate-400 cursor-not-allowed">
              Capacity Reached
            </div>
          ) : (
            <Link to="/login" className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors">
              Log in to Apply <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsub = onSnapshot(collection(db, "programs"), (snapshot) => {
      setPrograms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => p.status === "Active"));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A]">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-[#E2E8F0] py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold text-lg shadow-sm">D</span>
            <span className="font-bold text-slate-900 text-xl tracking-tight hidden sm:block">DISHA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Home</Link>
            <Link to="/our-programs" className="text-sm font-bold text-[#2563EB]">Programs</Link>
            <Link to="/our-impact" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Impact</Link>
            <Link to="/blogs" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Blogs</Link>
          </div>
          <Link to="/register" className="inline-flex items-center justify-center rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] shadow-sm">
            Volunteer Now
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="relative py-24 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-6">Our Initiatives</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6 text-[#0F172A]">Programs</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Discover the various ways you can contribute to society. Whether it's teaching, planting trees, or tech training, we have a program for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : programs.length > 0 ? (
            <motion.div 
              initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {programs.map((program) => (
                <ProgramCard key={program.id} prog={program} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <p>No active programs found at the moment. Please check back later!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
