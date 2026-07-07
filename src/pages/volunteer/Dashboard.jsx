import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "../../components/AnimatedCounter";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  orderBy
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Trophy,
  Clock,
  Calendar,
  Award,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Star,
  ChevronRight,
  Pin
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

function RadialProgress({ value, max = 100, color = "#2563EB", size = 56, stroke = 5 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = circ * pct;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeLinecap="round"
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />
    </svg>
  );
}

const rankColors = ["#F59E0B", "#94A3B8", "#B45309"];
const rankBg = ["bg-amber-50 border-amber-200", "bg-slate-50 border-slate-200", "bg-orange-50 border-orange-200"];

export default function VolunteerDashboard() {
  const { userProfile, currentUser } = useAuth();
  const [activePrograms, setActivePrograms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const appsQuery = query(collection(db, "applications"), where("userId", "==", currentUser.uid), where("status", "==", "Approved"), limit(5));
    const unsubscribeApps = onSnapshot(appsQuery, async (snapshot) => {
      const apps = snapshot.docs.map(doc => doc.data());
      if (apps.length === 0) { setActivePrograms([]); return; }
      const progsQuery = query(collection(db, "programs"), limit(10));
      const unsubscribeProgs = onSnapshot(progsQuery, (progSnap) => {
        const allProgs = progSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setActivePrograms(allProgs.filter(p => apps.some(a => a.programId === p.id)));
      });
      return () => unsubscribeProgs();
    });
    const annQuery = query(collection(db, "announcements"), orderBy("pinned", "desc"), limit(3));
    const unsubscribeAnn = onSnapshot(annQuery, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, console.error);
    const leadQuery = query(collection(db, "leaderboard"), orderBy("xp", "desc"), limit(5));
    const unsubscribeLead = onSnapshot(leadQuery, (snapshot) => {
      setLeaderboard(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => { unsubscribeApps(); unsubscribeAnn(); unsubscribeLead(); };
  }, [currentUser]);

  const xp = userProfile?.xp || 0;
  const hours = userProfile?.hours || 0;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXP = level * 100;
  const xpPct = ((xp % 100) / 100) * 100;

  const stats = [
    { label: "Total XP", value: xp, suffix: "", icon: Trophy, color: "#2563EB", bg: "from-blue-500/10 to-blue-600/5", ring: "#2563EB", detail: `Level ${level}`, detailColor: "text-blue-600 bg-blue-50 border-blue-100", progress: xpPct },
    { label: "Hours Served", value: hours, suffix: " hrs", icon: Clock, color: "#F97316", bg: "from-orange-500/10 to-orange-600/5", ring: "#F97316", detail: "Active", detailColor: "text-orange-600 bg-orange-50 border-orange-100", progress: Math.min(hours / 50 * 100, 100) },
    { label: "Programs", value: activePrograms.length, suffix: "", icon: Calendar, color: "#06B6D4", bg: "from-cyan-500/10 to-cyan-600/5", ring: "#06B6D4", detail: "Enrolled", detailColor: "text-cyan-600 bg-cyan-50 border-cyan-100", progress: Math.min(activePrograms.length * 20, 100) },
    { label: "Certificates", value: userProfile?.certificatesCount || 0, suffix: "", icon: Award, color: "#8B5CF6", bg: "from-violet-500/10 to-violet-600/5", ring: "#8B5CF6", detail: "Verified", detailColor: "text-violet-600 bg-violet-50 border-violet-100", progress: Math.min((userProfile?.certificatesCount || 0) * 25, 100) },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">

      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto md:min-h-[100px] flex items-center relative overflow-hidden">
        {/* Subtle animated background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 right-1/4 w-64 h-64 bg-cyan-100/30 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          {/* Left Column */}
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="hover:text-slate-800 cursor-pointer transition-colors">Volunteer</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">My Dashboard</span>
            </motion.div>
            
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
              <h1 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight mb-1" style={{fontFamily:"'Plus Jakarta Sans', Inter, sans-serif"}}>
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{userProfile?.displayName?.split(" ")[0] || "Volunteer"}</span> 👋
              </h1>
              <p className="text-[16px] text-[#64748B]">
                Your efforts are building a better India — every hour counts.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Actions */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center gap-3">
            {/* Level Badge */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm lg:mr-2">
              <RadialProgress value={xpPct} max={100} color="#2563EB" size={32} stroke={3} />
              <div>
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">Level {level}</p>
                <p className="text-xs font-bold text-slate-700 leading-none">{xp % 100} <span className="text-slate-400 font-medium">/ 100 XP</span></p>
              </div>
            </motion.div>

            {/* Secondary CTA */}
            <Link to="/leaderboard">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Leaderboard
              </motion.div>
            </Link>

            {/* Primary CTA */}
            <Link to="/programs">
              <motion.div whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)" }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm">
                Explore Programs
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -6, scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-sm cursor-default group`}
          >
            {/* Animated background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                  <stat.icon className="h-4.5 w-4.5" style={{ color: stat.color }} />
                </div>
                <RadialProgress value={stat.progress} max={100} color={stat.color} size={32} stroke={3} />
              </div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </h3>
              <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${stat.detailColor}`}>
                {stat.detail}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── BOTTOM BENTO GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* ── LEFT: Programs (span 3) ── */}
        <motion.div variants={fadeUp} className="lg:col-span-3 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Header strip */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <motion.div 
                animate={{ rotate: [0, 15, -15, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center"
              >
                <Target className="h-4 w-4 text-blue-600" />
              </motion.div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">My Active Programs</h3>
                <p className="text-[10px] text-slate-500 font-medium">Currently enrolled campaigns</p>
              </div>
            </div>
            <Link to="/programs">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">
                Browse All <ArrowRight className="h-3 w-3" />
              </motion.div>
            </Link>
          </div>

          <div className="p-5 flex-1">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : activePrograms.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center h-full">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                  <Target className="h-6 w-6 text-slate-300" />
                </div>
                <p className="font-bold text-slate-600 text-sm mb-1">No programs yet</p>
                <p className="text-slate-400 text-xs mb-4">Join a campaign and make an impact</p>
                <Link to="/programs"
                  className="inline-flex items-center gap-2 bg-[#0F172A] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                  Explore Programs <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {activePrograms.map((prog, idx) => (
                  <motion.div
                    key={prog.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ scale: 1.01 }}
                    className="group flex items-center gap-4 p-3.5 rounded-xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200 cursor-default"
                  >
                    {/* Colored initial avatar */}
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-black">
                      {prog.title?.charAt(0)?.toUpperCase() || "P"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{prog.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {prog.category} · {prog.location}
                      </p>
                    </div>

                    {/* Hours & XP pills */}
                    <div className="flex-shrink-0 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
                        {prog.hours || 0}h
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-md">
                        +{prog.xp || 0} XP
                      </span>
                    </div>

                    <span className="flex-shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md ml-2 hidden sm:block">
                      Active
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── RIGHT: Leaderboard (span 2) ── */}
        <motion.div variants={fadeUp} className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Top Volunteers</h3>
                <p className="text-[10px] text-slate-500 font-medium">State Rankings</p>
              </div>
            </div>
            <Link to="/leaderboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50">
              View All
            </Link>
          </div>

          <div className="flex-1 p-4 space-y-2">
            {loading ? (
              [1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)
            ) : leaderboard.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs font-semibold">Loading...</div>
            ) : leaderboard.map((user, idx) => {
              const maxXP = leaderboard[0]?.xp || 1;
              const barPct = Math.max((user.xp / maxXP) * 100, 8);
              const medal = ["🥇","🥈","🥉"][idx] || null;
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  whileHover={{ scale: 1.02 }}
                  className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all overflow-hidden ${
                    idx === 0 ? "bg-amber-50/50 border-amber-200/60" :
                    idx === 1 ? "bg-slate-50 border-slate-200" :
                    idx === 2 ? "bg-orange-50/50 border-orange-200/50" : "bg-white border-slate-100"
                  }`}
                >
                  {/* Animated bar behind */}
                  <motion.div
                    className={`absolute inset-y-0 left-0 opacity-[0.08] rounded-xl ${
                      idx === 0 ? "bg-amber-500" : idx === 1 ? "bg-slate-500" : "bg-blue-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${barPct}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 + idx * 0.07 }}
                  />

                  {/* Rank badge */}
                  <div className="relative flex-shrink-0 h-8 w-8 flex items-center justify-center">
                    {medal ? (
                      <motion.span
                        animate={idx === 0 ? { y: [0, -3, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-base leading-none drop-shadow-sm"
                      >{medal}</motion.span>
                    ) : (
                      <span className="h-6 w-6 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 relative">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.displayName}</p>
                    <p className="text-[9px] text-slate-500 font-medium">{user.hours || 0} hrs</p>
                  </div>

                  <div className="relative text-right flex-shrink-0">
                    <p className="text-[13px] font-black text-slate-800">{user.xp}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">XP</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── ANNOUNCEMENTS: Full-width timeline ── */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Pin className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Announcements & News</h3>
              <p className="text-[10px] text-slate-500 font-medium">Latest updates from DISHA HQ</p>
            </div>
          </div>
          <Link to="/announcements" className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg">
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="p-6">
          {announcements.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs font-medium">No recent announcements.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {announcements.map((ann, idx) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}
                  className="relative flex flex-col gap-3 p-5 rounded-xl bg-white border border-slate-200 transition-all duration-200 overflow-hidden group"
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 inset-x-0 h-1 ${ann.pinned ? "bg-amber-400" : "bg-slate-200 group-hover:bg-indigo-400 transition-colors"}`} />

                  {ann.pinned && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      <Pin className="h-2.5 w-2.5" /> PINNED
                    </div>
                  )}

                  <h4 className="text-sm font-bold text-slate-800 pr-12 leading-snug">{ann.title}</h4>
                  <p className="text-[12px] text-slate-600 leading-relaxed line-clamp-3 flex-1">{ann.content}</p>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2 text-[10px] text-slate-500 font-medium">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {ann.author?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                    <span>{ann.author}</span>
                    <span className="ml-auto text-slate-400">{ann.createdAt?.seconds ? new Date(ann.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

    </motion.div>
  );
}
