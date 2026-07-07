import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, where, addDoc, getDocs, updateDoc, doc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { CheckCircle2, UserCheck, ShieldAlert, Award, CalendarClock, Target, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function Attendance() {
  const { currentUser, userProfile } = useAuth();
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [activePrograms, setActivePrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  useEffect(() => {
    if (!currentUser) return;

    // 1. Fetch user attendance history logs
    const q = query(
      collection(db, "attendance"),
      where("userId", "==", currentUser.uid)
    );
    const unsubscribeLogs = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      logs.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setAttendanceLogs(logs);
      setLoading(false);
    });

    // 2. Fetch approved program enrollments to check in
    const appsQuery = query(
      collection(db, "applications"),
      where("userId", "==", currentUser.uid),
      where("status", "==", "Approved")
    );
    const unsubscribeApps = onSnapshot(appsQuery, async (snapshot) => {
      const apps = snapshot.docs.map(doc => doc.data());
      if (apps.length === 0) {
        setActivePrograms([]);
        return;
      }
      const progSnap = await getDocs(query(collection(db, "programs")));
      const allProgs = progSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const userProgs = allProgs.filter(p => apps.some(a => a.programId === p.id));
      setActivePrograms(userProgs);
      if (userProgs.length > 0) setSelectedProgramId(userProgs[0].id);
    });

    return () => {
      unsubscribeLogs();
      unsubscribeApps();
    };
  }, [currentUser]);

  const handleSelfCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedProgramId) return toast.error("Please select a program");
    if (!sessionCode) return toast.error("Please enter the 6-digit session check-in code");

    // Standard session check-in verification code is 'DISHA6' (mock verification)
    if (sessionCode.trim().toUpperCase() !== "DISHA6") {
      return toast.error("Invalid session verification code");
    }

    const selectedProgram = activePrograms.find(p => p.id === selectedProgramId);
    if (!selectedProgram) return toast.error("Program details not found");

    // Check if already checked in for today
    const today = new Date().toISOString().split('T')[0];
    const alreadyLogged = attendanceLogs.some(
      (log) => log.programId === selectedProgramId && log.date === today
    );

    if (alreadyLogged) {
      return toast.error("You have already logged attendance for this program today");
    }

    try {
      setSubmitting(true);

      // Create attendance log entry
      await addDoc(collection(db, "attendance"), {
        userId: currentUser.uid,
        userName: userProfile?.displayName || currentUser.displayName || "Volunteer",
        programId: selectedProgramId,
        programTitle: selectedProgram.title,
        date: today,
        hours: selectedProgram.hours || 2,
        xpEarned: selectedProgram.xp || 50,
        status: "Present",
        verified: true,
        loggedAt: serverTimestamp()
      });

      // Update volunteer profile metrics (XP and Hours)
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        xp: increment(selectedProgram.xp || 50),
        hours: increment(selectedProgram.hours || 2)
      });

      // Create notification
      await addDoc(collection(db, "notifications"), {
        userId: currentUser.uid,
        title: "Attendance Logged!",
        message: `You earned +${selectedProgram.xp} XP and logged ${selectedProgram.hours} hours for participating in '${selectedProgram.title}'.`,
        read: false,
        createdAt: serverTimestamp()
      });

      toast.success("Attendance marked and rewards credited!");
      setSessionCode("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to register attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLogs = attendanceLogs.filter(log => 
    log.programTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalHours = attendanceLogs.reduce((acc, log) => acc + (log.hours || 0), 0);
  const totalXP = attendanceLogs.reduce((acc, log) => acc + (log.xpEarned || 0), 0);

  // Aggregate data for the chart
  const chartDataMap = {};
  filteredLogs.forEach(log => {
    const dateStr = log.date ? new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Unknown";
    if (!chartDataMap[dateStr]) {
      chartDataMap[dateStr] = { date: dateStr, hours: 0, xp: 0, fullDate: log.date || "" };
    }
    chartDataMap[dateStr].hours += (log.hours || 0);
    chartDataMap[dateStr].xp += (log.xpEarned || 0);
  });
  const chartData = Object.values(chartDataMap).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

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
              <Link to="/dashboard" className="hover:text-slate-800 transition-colors">Volunteer</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Attendance</span>
            </motion.div>
            

          </div>

          {/* Right Column: Actions & Stats */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Sessions</span>
                <span className="text-lg font-black text-slate-800 leading-none">{attendanceLogs.length}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-1" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest">Hours</span>
                <span className="text-lg font-black text-blue-600 leading-none">{totalHours}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-1" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest">XP Earned</span>
                <span className="text-lg font-black text-amber-600 leading-none">{totalXP}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        
        {/* Attendance History Chart */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:col-span-1">
          {/* Header toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <CalendarClock className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Attendance Logs</h3>
                <p className="text-[10px] text-slate-500 font-medium">Verified community service sessions</p>
              </div>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block pl-9 p-2.5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="p-0 flex-1">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : filteredLogs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-slate-300" />
                </div>
                <p className="font-bold text-slate-600 text-sm mb-1">
                  {searchTerm ? "No matching logs found" : "No attendance records yet"}
                </p>
                <p className="text-slate-400 text-xs mb-5">
                  {searchTerm ? "Try a different search term." : "Submit your first check-in to start earning XP!"}
                </p>
              </motion.div>
            ) : (
              <div className="h-[400px] w-full p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                      dx={-10}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                      dx={10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#1E293B' }}
                      cursor={{ fill: '#F1F5F9' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold', color: '#64748B' }} />
                    <Bar yAxisId="left" dataKey="hours" name="Hours Served" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={50} />
                    <Bar yAxisId="right" dataKey="xp" name="XP Earned" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
