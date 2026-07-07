import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { BarChart3, TrendingUp, Award, Clock, Users, Target } from "lucide-react";
import { motion } from "framer-motion";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function AdminAnalytics() {
  const [volunteersCount, setVolunteersCount] = useState(0);
  const [hoursCount, setHoursCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [programsCount, setProgramsCount] = useState(0);

  // Sample static trends that overlay with database counts
  const engagementData = [
    { name: "Jan", volunteers: 10, hours: 25, certificates: 5 },
    { name: "Feb", volunteers: 20, hours: 55, certificates: 8 },
    { name: "Mar", volunteers: 35, hours: 90, certificates: 15 },
    { name: "Apr", volunteers: 48, hours: 140, certificates: 22 },
    { name: "May", volunteers: 62, hours: 210, certificates: 35 },
    { name: "Jun", volunteers: 85, hours: 290, certificates: 48 },
    { name: "Jul", volunteers: 110, hours: 380, certificates: 64 }
  ];

  const programData = [
    { name: "Education", limit: 50, enrolled: 44 },
    { name: "Environment", limit: 80, enrolled: 68 },
    { name: "Social Relief", limit: 30, enrolled: 29 },
    { name: "Health", limit: 40, enrolled: 12 }
  ];

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setVolunteersCount(snapshot.size);
    });

    const unsubCerts = onSnapshot(collection(db, "certificates"), (snapshot) => {
      setCertsCount(snapshot.size);
    });

    const unsubProgs = onSnapshot(collection(db, "programs"), (snapshot) => {
      setProgramsCount(snapshot.size);
    });

    const unsubAttendance = onSnapshot(collection(db, "attendance"), (snapshot) => {
      let hrs = 0;
      snapshot.docs.forEach(doc => { hrs += doc.data().hours || 0; });
      setHoursCount(hrs);
    });

    return () => {
      unsubUsers();
      unsubCerts();
      unsubProgs();
      unsubAttendance();
    };
  }, []);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 left-1/2 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Analytics</span>
            </motion.div>
            

          </div>
        </div>
      </div>
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Volunteers */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 h-24 w-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-10 w-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-xs">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Live</span>
          </div>
          <div className="relative z-10">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Volunteers</span>
            <h3 className="text-3xl font-black text-slate-800">{volunteersCount}</h3>
          </div>
        </motion.div>

        {/* Hours */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 h-24 w-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-10 w-10 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-xs">
              <Clock className="h-5 w-5" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"><TrendingUp className="h-3 w-3"/> +12%</span>
          </div>
          <div className="relative z-10">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hours Volunteered</span>
            <h3 className="text-3xl font-black text-slate-800">{hoursCount}</h3>
          </div>
        </motion.div>

        {/* Certificates */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 h-24 w-24 bg-violet-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-10 w-10 bg-violet-50 border border-violet-100 text-violet-600 rounded-xl flex items-center justify-center shadow-xs">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Certificates Issued</span>
            <h3 className="text-3xl font-black text-slate-800">{certsCount}</h3>
          </div>
        </motion.div>

        {/* Programs */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 h-24 w-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-10 w-10 bg-orange-50 border border-orange-100 text-orange-600 rounded-xl flex items-center justify-center shadow-xs">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Active Campaigns</span>
            <h3 className="text-3xl font-black text-slate-800">{programsCount}</h3>
          </div>
        </motion.div>

      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Volunteer & Hours Trend */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Volunteer Growth & Hours Trend</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Realtime progress of total participation since platform startup.</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHrs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold", paddingTop: '20px' }} iconType="circle" />
                <Area type="monotone" dataKey="volunteers" name="Volunteers Count" stroke="#2563EB" fillOpacity={1} fill="url(#colorVol)" strokeWidth={3} />
                <Area type="monotone" dataKey="hours" name="Total Hours Logged" stroke="#059669" fillOpacity={1} fill="url(#colorHrs)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Program category metrics */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Enrollments by Campaign Category</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Summary of volunteer registration rates vs available slots.</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: "bold", paddingTop: '20px' }} iconType="circle" />
                <Bar dataKey="enrolled" name="Enrolled Volunteers" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="limit" name="Target Cap Limit" fill="#E2E8F0" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
}
