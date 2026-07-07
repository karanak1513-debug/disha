import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  collection, onSnapshot, query, addDoc, where, serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Calendar, Users, CheckCircle2, Clock,
  Zap, ArrowUpRight, X, BookOpen, Leaf, Heart, Activity,
  Globe, SlidersHorizontal, Flame, Star, ChevronDown, LayoutGrid, List
} from "lucide-react";

/* ─── Animation presets ─────────────────────────────────────────── */
const fadeUp   = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:0.45,ease:[0.22,1,0.36,1]}} };
const stagger  = { hidden:{opacity:0}, show:{opacity:1,transition:{staggerChildren:0.06}} };

/* ─── Category config ────────────────────────────────────────────── */
const CATS = {
  All:           { icon:Globe,    grad:"from-slate-700 to-slate-900",   pill:"bg-slate-900 text-white",           idle:"bg-white border-slate-200 text-slate-600 hover:border-slate-400" },
  Education:     { icon:BookOpen, grad:"from-violet-600 to-purple-800", pill:"bg-violet-600 text-white",          idle:"bg-violet-50 border-violet-200 text-violet-700 hover:border-violet-400" },
  Environment:   { icon:Leaf,     grad:"from-emerald-600 to-teal-800",  pill:"bg-emerald-600 text-white",         idle:"bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400" },
  "Social Relief":{ icon:Heart,   grad:"from-rose-600 to-pink-800",     pill:"bg-rose-600 text-white",            idle:"bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-400" },
  Health:        { icon:Activity, grad:"from-orange-500 to-amber-700",  pill:"bg-orange-500 text-white",          idle:"bg-orange-50 border-orange-200 text-orange-700 hover:border-orange-400" },
};

const STATUS_STYLE = {
  Approved: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Rejected:  "text-rose-700 bg-rose-50 border-rose-200",
  Pending:   "text-amber-700 bg-amber-50 border-amber-200",
};
const STATUS_ICON = {
  Approved: "✓ Enrolled",
  Rejected:  "✕ Rejected",
  Pending:   "⏳ Pending",
};

/* ─── Subcomponents ─────────────────────────────────────────────── */
function FillBar({ registered = 0, limit = 1 }) {
  const pct  = Math.min((registered / limit) * 100, 100);
  const full = registered >= limit;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold text-slate-400">
        <span className="flex items-center gap-1"><Users className="h-3 w-3"/> {registered}/{limit} spots</span>
        <span className={full?"text-rose-500":"text-slate-400"}>{full?"Full":Math.round(pct)+"% filled"}</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${full?"bg-rose-400":"bg-gradient-to-r from-blue-500 to-cyan-400"}`}
          initial={{width:0}} animate={{width:`${pct}%`}}
          transition={{duration:0.9,ease:"easeOut",delay:0.15}}
        />
      </div>
    </div>
  );
}

function ProgramCard({ prog, app, onApply, applying }) {
  const cfg     = CATS[prog.category] || CATS.All;
  const Icon    = cfg.icon;
  const isApplied = !!app;
  const isFull    = (prog.registeredCount||0) >= prog.volunteerLimit;
  const isApplying = applying === prog.id;

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
            <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.1) 1px,transparent 1px)",backgroundSize:"16px 16px"}}/>
            <Icon className="h-10 w-10 text-white/20"/>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${cfg.pill} shadow-sm`}>
            <Icon className="h-2 w-2"/> {prog.category}
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
            <Clock className="h-3 w-3 text-slate-400"/> {prog.hours} Hrs
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-700">
            <Zap className="h-3 w-3 text-amber-500"/> +{prog.xp} XP
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 mb-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0"/>
            <span className="truncate">{prog.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-slate-400 shrink-0"/>
            <span className="truncate">{prog.deadline}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <FillBar registered={prog.registeredCount||0} limit={prog.volunteerLimit}/>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {isApplied ? (
            <div className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[11px] font-bold ${STATUS_STYLE[app?.status]}`}>
              <CheckCircle2 className="h-3 w-3"/> {STATUS_ICON[app?.status]}
            </div>
          ) : isFull ? (
            <div className="flex items-center justify-center w-full py-2 rounded-xl bg-slate-100 text-[11px] font-bold text-slate-400 cursor-not-allowed">
              Capacity Reached
            </div>
          ) : (
            <motion.button
              whileTap={{scale:0.98}}
              onClick={()=>onApply(prog)}
              disabled={isApplying}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors disabled:opacity-50"
            >
              {isApplying ? (
                <>
                  <motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full"/>
                  Processing...
                </>
              ) : (
                <>Apply Now <ArrowUpRight className="h-3 w-3"/></>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function Programs() {
  const { currentUser, userProfile } = useAuth();
  const [programs, setPrograms]             = useState([]);
  const [userApplications, setUserApps]     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [category, setCategory]             = useState("All");
  const [applyingId, setApplyingId]         = useState(null);
  const [showFilter, setShowFilter]         = useState(false);

  useEffect(() => {
    const unsubP = onSnapshot(collection(db,"programs"),(s)=>{
      setPrograms(s.docs.map(d=>({id:d.id,...d.data()})).filter(p=>p.status==="Active"));
      setLoading(false);
    });
    const unsubA = onSnapshot(query(collection(db,"applications"),where("userId","==",currentUser?.uid||"")),
      (s)=>setUserApps(s.docs.map(d=>({id:d.id,...d.data()}))));
    return ()=>{unsubP();unsubA();};
  },[currentUser]);

  const handleApply = async (prog) => {
    if (!currentUser) return toast.error("Please log in first");
    if (userApplications.some(a=>a.programId===prog.id)) return toast.error("Already applied");
    setApplyingId(prog.id);
    try {
      await addDoc(collection(db,"applications"),{
        userId:currentUser.uid,
        userName:userProfile?.displayName||currentUser.displayName||"Volunteer",
        userEmail:currentUser.email,
        programId:prog.id, programTitle:prog.title,
        status:"Pending", appliedAt:serverTimestamp()
      });
      await addDoc(collection(db,"notifications"),{
        userId:currentUser.uid,
        title:"Application Submitted",
        message:`Your application to '${prog.title}' has been submitted.`,
        read:false, createdAt:serverTimestamp()
      });
      toast.success("Application submitted!");
    } catch(e){ console.error(e); toast.error("Failed"); }
    finally{ setApplyingId(null); }
  };

  const filtered = useMemo(()=>programs.filter(p=>{
    const q=search.toLowerCase();
    return (!q||[p.title,p.description,p.location].some(v=>v?.toLowerCase().includes(q)))
      && (category==="All"||p.category===category);
  }),[programs,search,category]);

  const catCounts = useMemo(()=>{
    const counts={"All":programs.length};
    programs.forEach(p=>{counts[p.category]=(counts[p.category]||0)+1;});
    return counts;
  },[programs]);

  return (
    <div className="space-y-0 pb-8">

      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto md:min-h-[100px] flex items-center">
        <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          {/* Left Column */}
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="hover:text-slate-800 cursor-pointer transition-colors">Volunteer</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Explore Programs</span>
            </motion.div>
            

          </div>

          {/* Right Column: Actions */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder="Search programs..."
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-9 pr-8 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.8}}
                    onClick={()=>setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            {/* Filters */}
            <button className="group flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <SlidersHorizontal className="h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
              Filters
            </button>

            {/* Sort */}
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              Sort by
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>

            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60 hidden sm:flex">
              <button className="p-1.5 bg-white text-slate-800 rounded-md shadow-sm border border-slate-200/50 hover:bg-slate-50 transition-colors">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white/50 rounded-md transition-colors">
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Primary CTA */}
            <button className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95">
              <Globe className="h-4 w-4" />
              Browse Categories
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── CATEGORY TABS (Moved below header) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {Object.entries(CATS).map(([cat,cfg])=>{
            const Icon = cfg.icon;
            const active = category===cat;
            return (
              <button key={cat}
                onClick={()=>setCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  active 
                    ? "bg-slate-900 text-white border-transparent shadow-md" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? "text-white/80" : "text-slate-400"}`} />
                {cat}
                {catCounts[cat] != null && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] ${
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}>
                    {catCounts[cat]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <span className="text-xs text-slate-400 font-medium shrink-0">
          Showing {filtered.length} programs
        </span>
      </div>

      {/* ── GRID ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(n=>(
            <div key={n} className="rounded-3xl bg-slate-100 animate-pulse" style={{height:380}}/>
          ))}
        </div>
      ) : filtered.length===0 ? (
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          className="flex flex-col items-center justify-center py-24 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
            <Globe className="h-7 w-7 text-slate-200"/>
          </div>
          <h3 className="font-bold text-slate-500 text-sm mb-1">No programs found</h3>
          <p className="text-slate-400 text-xs mb-4">Try a different category or clear your search.</p>
          <button onClick={()=>{setSearch("");setCategory("All");}}
            className="px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-700 transition-colors">
            Reset Filters
          </button>
        </motion.div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(prog=>(
            <ProgramCard
              key={prog.id}
              prog={prog}
              app={userApplications.find(a=>a.programId===prog.id)}
              onApply={handleApply}
              applying={applyingId}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
