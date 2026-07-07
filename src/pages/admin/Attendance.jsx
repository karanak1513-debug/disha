import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, getDocs, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { UserCheck, Plus, CheckCircle, Clock, CalendarDays, User, ClipboardList, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function AdminAttendance() {
  const [logs, setLogs] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedVolId, setSelectedVolId] = useState("");
  const [selectedProgId, setSelectedProgId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch attendance logs
    const unsubLogs = onSnapshot(collection(db, "attendance"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      setLogs(data);
      setLoading(false);
    });

    // 2. Fetch volunteers list
    const unsubVolunteers = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVolunteers(data.filter(u => u.role === "Volunteer"));
    });

    // 3. Fetch programs list
    const unsubProgs = onSnapshot(collection(db, "programs"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrograms(data.filter(p => p.status === "Active"));
    });

    return () => {
      unsubLogs();
      unsubVolunteers();
      unsubProgs();
    };
  }, []);

  // Set default dropdown values
  useEffect(() => {
    if (volunteers.length > 0 && !selectedVolId) setSelectedVolId(volunteers[0].id);
    if (programs.length > 0 && !selectedProgId) setSelectedProgId(programs[0].id);
  }, [volunteers, programs]);

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedVolId || !selectedProgId) {
      return toast.error("Please select a volunteer and a program campaign");
    }

    const volunteer = volunteers.find(v => v.id === selectedVolId);
    const program = programs.find(p => p.id === selectedProgId);

    if (!volunteer || !program) return toast.error("Selection mapping details invalid");

    // Check if attendance already recorded today
    const today = new Date().toISOString().split('T')[0];
    const alreadyLogged = logs.some(
      (l) => l.userId === selectedVolId && l.programId === selectedProgId && l.date === today
    );

    if (alreadyLogged) {
      return toast.error("Attendance for this volunteer in this program has already been logged today");
    }

    try {
      setSubmitting(true);

      // 1. Create log
      await addDoc(collection(db, "attendance"), {
        userId: selectedVolId,
        userName: volunteer.displayName || "Volunteer",
        programId: selectedProgId,
        programTitle: program.title,
        date: today,
        hours: program.hours || 2,
        xpEarned: program.xp || 50,
        status: "Present",
        verified: true,
        loggedAt: serverTimestamp()
      });

      // 2. Increment volunteer profile hours/xp
      const volRef = doc(db, "users", selectedVolId);
      await updateDoc(volRef, {
        xp: increment(program.xp || 50),
        hours: increment(program.hours || 2)
      });

      // 3. Notify user
      await addDoc(collection(db, "notifications"), {
        userId: selectedVolId,
        title: "Attendance Logged by Admin",
        message: `Admin has marked you present for '${program.title}'. Credited +${program.xp} XP and ${program.hours} hours.`,
        read: false,
        createdAt: serverTimestamp()
      });

      toast.success("Volunteer check-in logged and credited!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark check-in");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (logId, newStatus) => {
    try {
      const logRef = doc(db, "attendance", logId);
      await updateDoc(logRef, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const logsToday = logs.filter(l => l.date === todayStr).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 left-1/2 w-64 h-64 bg-teal-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Attendance</span>
            </motion.div>
            

          </div>
          
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}} className="flex-shrink-0 flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col items-end border-r border-slate-200 pr-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Logs</span>
              <span className="text-2xl font-black text-slate-800">{logs.length}</span>
            </div>
            <div className="flex flex-col items-start pl-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Logged Today</span>
              <span className="text-2xl font-black text-emerald-600">{logsToday}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Manual Check-in Bento */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-blue-100 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Log Manual Attendance</h3>
              <p className="text-[11px] text-slate-500 font-medium">Directly credit hours to volunteers</p>
            </div>
          </div>

          {volunteers.length === 0 || programs.length === 0 ? (
            <div className="space-y-4">
              <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
              <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Loading directory listings...</p>
            </div>
          ) : (
            <form onSubmit={handleManualCheckIn} className="space-y-5">
              
              {/* Select volunteer */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Volunteer
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <select
                    value={selectedVolId}
                    onChange={(e) => setSelectedVolId(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-[13px] font-semibold text-slate-800 bg-slate-50/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    {volunteers.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.displayName} ({v.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Select Program */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Program Event
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                  </div>
                  <select
                    value={selectedProgId}
                    onChange={(e) => setSelectedProgId(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-[13px] font-semibold text-slate-800 bg-slate-50/50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (+{p.xp} XP)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Static Check in info code */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 flex gap-3 mt-2">
                <div className="flex-shrink-0 mt-0.5">
                  <ClipboardList className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                  Self check-in code for all active programs is statically configured to <strong className="text-slate-800 bg-white px-1.5 py-0.5 rounded border shadow-xs ml-1">DISHA6</strong>. Volunteers can mark themselves present via their dashboard.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-[13px] font-bold text-white hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98] disabled:opacity-70"
              >
                {submitting ? "Logging check-in..." : "Mark Present"}
              </button>

            </form>
          )}
        </motion.div>

        {/* Attendance Logs List Bento */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:col-span-2">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">System-wide Attendance Logs</h3>
              <p className="text-[11px] text-slate-500 font-medium">Realtime logs of all checked in volunteers</p>
            </div>
          </div>

          <div className="flex-1 bg-white">
            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : logs.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="h-16 w-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4">
                  <Clock className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No attendance registered today</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm font-medium">Use the manual logger on the left or instruct volunteers to check in using their portal.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                      <th className="py-4 px-6">Volunteer</th>
                      <th className="py-4 px-6">Program</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6 text-center">Hours</th>
                      <th className="py-4 px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-semibold">
                    <AnimatePresence>
                      {logs.map((log) => (
                        <motion.tr 
                          key={log.id} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-slate-50/70 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black bg-slate-50 border border-slate-200 text-slate-600 shadow-sm">
                                {log.userName?.charAt(0) || "?"}
                              </div>
                              <span className="font-bold text-slate-800 text-[13px]">{log.userName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-slate-600">{log.programTitle}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-500 font-medium">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                              {log.date}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 shadow-xs">
                              <Clock className="h-3 w-3 text-orange-400" />
                              {log.hours}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <select
                              value={log.status || "Present"}
                              onChange={(e) => handleStatusChange(log.id, e.target.value)}
                              className={`inline-flex appearance-none outline-none items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold border shadow-xs uppercase tracking-wider cursor-pointer ${
                                log.status === "Absent" ? "bg-rose-50 border-rose-200 text-rose-700" :
                                log.status === "Excused" ? "bg-amber-50 border-amber-200 text-amber-700" :
                                "bg-emerald-50 border-emerald-200 text-emerald-700"
                              }`}
                            >
                              <option value="Present">PRESENT</option>
                              <option value="Absent">ABSENT</option>
                              <option value="Excused">EXCUSED</option>
                            </select>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
