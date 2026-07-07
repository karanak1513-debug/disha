import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "../../components/AnimatedCounter";
import {
  collection, onSnapshot, query, limit
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Users,
  Calendar,
  Clock,
  Award,
  LifeBuoy,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  BarChart3,
  Inbox
} from "lucide-react";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};
const slideIn = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

function PulsingDot({ color = "bg-emerald-500" }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-50`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}

function StatCard({ label, value, suffix = "", icon: Icon, color, trend }) {
  const colorMap = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100", badge: "text-blue-700 bg-blue-50 border-blue-100", bar: "bg-blue-500" },
    orange: { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-100", badge: "text-orange-700 bg-orange-50 border-orange-100", bar: "bg-orange-500" },
    cyan: { bg: "bg-cyan-50", icon: "text-cyan-600", border: "border-cyan-100", badge: "text-cyan-700 bg-cyan-50 border-cyan-100", bar: "bg-cyan-500" },
    violet: { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-100", badge: "text-violet-700 bg-violet-50 border-violet-100", bar: "bg-violet-500" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-100", badge: "text-amber-700 bg-amber-50 border-amber-100", bar: "bg-amber-500" },
    rose: { bg: "bg-rose-50", icon: "text-rose-600", border: "border-rose-100", badge: "text-rose-700 bg-rose-50 border-rose-100", bar: "bg-rose-500" },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 cursor-default shadow-sm"
    >
      <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl opacity-40 ${c.bg}`} />
      <div className="relative z-10">
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${c.bg} border ${c.border} mb-4`}>
          <Icon className={`h-4 w-4 ${c.icon}`} />
        </div>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-800 mb-2">
          <AnimatedCounter value={value} suffix={suffix} />
        </h3>
        {trend && (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${c.badge}`}>{trend}</span>
        )}
      </div>
    </motion.div>
  );
}

const quickActions = [
  { to: "/admin/programs", icon: Calendar, label: "New Program", color: "blue" },
  { to: "/admin/applications", icon: FileText, label: "App Review", color: "violet" },
  { to: "/admin/attendance", icon: Clock, label: "Log Hours", color: "cyan" },
  { to: "/admin/announcements", icon: Bell, label: "Broadcast", color: "amber" },
  { to: "/admin/certificates", icon: Award, label: "Issue Cert", color: "orange" },
  { to: "/admin/reports", icon: BarChart3, label: "Reports", color: "teal" },
  { to: "/admin/users", icon: Users, label: "Users", color: "slate" },
  { to: "/admin/support", icon: LifeBuoy, label: "Support", color: "rose" },
];
const qaColorMap = {
  blue: "bg-white border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200",
  violet: "bg-white border-slate-200 text-violet-600 hover:bg-violet-50 hover:border-violet-200",
  cyan: "bg-white border-slate-200 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-200",
  amber: "bg-white border-slate-200 text-amber-600 hover:bg-amber-50 hover:border-amber-200",
  orange: "bg-white border-slate-200 text-orange-600 hover:bg-orange-50 hover:border-orange-200",
  teal: "bg-white border-slate-200 text-teal-600 hover:bg-teal-50 hover:border-teal-200",
  slate: "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300",
  rose: "bg-white border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200",
};

const healthServices = [
  { name: "Firestore Database", status: "Online", ok: true },
  { name: "Authentication", status: "Active", ok: true },
  { name: "Cloud Storage", status: "Active", ok: true },
  { name: "API Functions", status: "Healthy", ok: true },
];

export default function AdminDashboard() {
  const { userProfile } = useAuth();

  const [stats, setStats] = useState({
    totalVolunteers: 0, activePrograms: 0, hoursServed: 0,
    certificatesCount: 0, pendingApps: 0, openTickets: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (s) =>
      setStats(p => ({ ...p, totalVolunteers: s.size })));
    const unsubProgs = onSnapshot(collection(db, "programs"), (s) => {
      setStats(p => ({ ...p, activePrograms: s.docs.filter(d => d.data().status === "Active").length }));
    });
    const unsubAttendance = onSnapshot(collection(db, "attendance"), (s) => {
      let hours = 0;
      s.docs.forEach(doc => { hours += doc.data().hours || 0; });
      setStats(p => ({ ...p, hoursServed: hours }));
    });
    const unsubCerts = onSnapshot(collection(db, "certificates"), (s) =>
      setStats(p => ({ ...p, certificatesCount: s.size })));
    const unsubApps = onSnapshot(collection(db, "applications"), (s) => {
      const pending = s.docs.filter(d => d.data().status === "Pending");
      setStats(p => ({ ...p, pendingApps: pending.length }));
      const apps = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      apps.sort((a, b) => (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0));
      setRecentApps(apps.slice(0, 5));
    });
    const unsubTickets = onSnapshot(collection(db, "supportTickets"), (s) => {
      const open = s.docs.filter(d => d.data().status === "Open");
      setStats(p => ({ ...p, openTickets: open.length }));
      const tkts = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      tkts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRecentTickets(tkts.slice(0, 4));
    });
    return () => { unsubUsers(); unsubProgs(); unsubAttendance(); unsubCerts(); unsubApps(); unsubTickets(); };
  }, []);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      {/* ── PROFESSIONAL PAGE HEADER (Combines old global title & hero) ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        {/* Subtle animated background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 left-1/2 w-64 h-64 bg-violet-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          {/* Left Column */}
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Admin Dashboard</span>
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-blue-600 shadow-sm">
                <PulsingDot color="bg-emerald-500" /> Control Hub
              </span>
            </motion.div>
            
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
              <h1 className="text-[32px] font-bold text-[#0F172A] leading-tight tracking-tight mb-2" style={{fontFamily:"'Plus Jakarta Sans', Inter, sans-serif"}}>
                Welcome,{" "}
                <span className="bg-gradient-to-r from-blue-600 via-violet-500 to-blue-400 bg-clip-text text-transparent">
                  {userProfile?.displayName || "Admin"} ⚡
                </span>
              </h1>
              <p className="text-[15px] text-[#64748B] max-w-lg leading-relaxed">
                Manage volunteers, review applications, configure campaigns, and keep the DISHA mission on track.
              </p>
            </motion.div>

            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex items-center gap-3 pt-2">
              <Link
                to="/admin/applications"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-200 transition-all duration-300 active:scale-95"
              >
                Review Applications
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/admin/reports"
                className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 shadow-sm"
              >
                <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
                View Reports
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Live Activity */}
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}} className="flex-shrink-0 flex flex-col gap-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-5 shadow-sm min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Live Activity</p>
            </div>
            {[
              { label: "Pending Apps", val: stats.pendingApps, color: "text-amber-600" },
              { label: "Open Tickets", val: stats.openTickets, color: "text-rose-600" },
              { label: "Total Hours", val: stats.hoursServed, color: "text-blue-600" },
            ].map((item, i) => (
              <div key={item.label} className={`flex items-center justify-between ${i !== 2 ? 'border-b border-slate-100 pb-2' : ''}`}>
                <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                <span className={`text-sm font-black ${item.color}`}>{item.val}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Volunteers" value={stats.totalVolunteers} icon={Users} color="blue" trend="Registered" />
        <StatCard label="Campaigns" value={stats.activePrograms} suffix=" Active" icon={Calendar} color="cyan" trend="Running" />
        <StatCard label="Total Hours" value={stats.hoursServed} suffix=" Hrs" icon={Clock} color="orange" trend="Contributed" />
        <StatCard label="Certificates" value={stats.certificatesCount} icon={Award} color="violet" trend="Issued" />
        <StatCard label="Pending Apps" value={stats.pendingApps} icon={FileText} color="amber" trend="Need Review" />
        <StatCard label="Open Tickets" value={stats.openTickets} icon={LifeBuoy} color="rose" trend="Awaiting Reply" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
          <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Quick Actions</h3>
            <p className="text-[10px] text-slate-500 font-medium">Common administrative tasks</p>
          </div>
        </div>
        <div className="p-5 grid grid-cols-4 sm:grid-cols-8 gap-3 bg-white">
          {quickActions.map((action, idx) => (
            <motion.div key={action.to} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.04 }}>
              <Link
                to={action.to}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 active:scale-95 shadow-xs ${qaColorMap[action.color]}`}
              >
                <action.icon className="h-5 w-5 mb-1.5" />
                <span className="text-[10px] font-bold leading-tight">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── LOWER BENTO GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── LEFT: Applications & Tickets (span 2) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Recent Applications Bento */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <Inbox className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Recent Applications</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Volunteers awaiting approval</p>
                </div>
              </div>
              <Link to="/admin/applications" className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="p-0 bg-white">
              {recentApps.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold">No recent applications.</div>
              ) : (
                <div className="flex flex-col divide-y divide-slate-100">
                  {recentApps.map((app, idx) => (
                    <motion.div
                      key={app.id}
                      variants={slideIn}
                      className="group flex items-center gap-4 p-4 hover:bg-slate-50 transition-all duration-200 cursor-default"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 text-xs font-black border border-violet-100/50">
                        {app.userName?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{app.userName}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400" />
                          {app.programTitle}
                        </p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-bold px-3 py-1 rounded-md border ${
                        app.status === "Approved"
                          ? "text-emerald-700 bg-emerald-50 border-emerald-100 shadow-sm"
                          : app.status === "Rejected"
                          ? "text-rose-700 bg-rose-50 border-rose-100 shadow-sm"
                          : "text-amber-700 bg-amber-50 border-amber-100 shadow-sm"
                      }`}>
                        {app.status === "Approved" ? "✓ " : app.status === "Pending" ? "⏳ " : "✕ "}{app.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Support Tickets Bento */}
          <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <LifeBuoy className="h-4 w-4 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Support Tickets</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Recent helpdesk queries</p>
                </div>
              </div>
              <Link to="/admin/support" className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
                Resolve Issues <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="p-0 bg-white">
              {recentTickets.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-3 text-center text-slate-400 text-xs font-semibold">
                  <CheckCircle2 className="h-10 w-10 text-emerald-300" />
                  All clear! No pending support requests.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-slate-100">
                  {recentTickets.map((tkt, idx) => (
                    <motion.div
                      key={tkt.id}
                      variants={slideIn}
                      className="group flex items-center gap-4 p-4 hover:bg-slate-50 transition-all duration-200 cursor-default"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{tkt.subject}</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                          By {tkt.volunteerName} • Priority: <span className="font-bold text-slate-700">{tkt.priority}</span>
                        </p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-bold px-3 py-1 rounded-md border ${
                        tkt.status === "Open" ? "text-rose-700 bg-rose-50 border-rose-100 shadow-sm" : "text-emerald-700 bg-emerald-50 border-emerald-100 shadow-sm"
                      }`}>
                        {tkt.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* ── RIGHT: Platform Health (span 1) ── */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Activity className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Platform Health</h3>
              <p className="text-[10px] text-slate-500 font-medium">System services status</p>
            </div>
          </div>

          <div className="flex-1 p-5 space-y-4">
            <div className="space-y-3">
              {healthServices.map((svc, idx) => (
                <motion.div
                  key={svc.name}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  className="group flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-emerald-50 hover:border-emerald-100 transition-all cursor-default"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-emerald-200 transition-colors">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                    <PulsingDot color="bg-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600">{svc.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Uptime banner */}
            <div className="mt-4 p-5 rounded-xl bg-[#0F172A] text-white relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">System Uptime</span>
                </div>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-3xl font-black tracking-tight">99.9</span>
                  <span className="text-xs font-bold text-slate-400 mb-1">% this month</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "99.9%" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
