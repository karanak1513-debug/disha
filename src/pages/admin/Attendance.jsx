import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, getDocs, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { UserCheck, Plus, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 gap-6 lg:grid-cols-3"
    >
      
      {/* Manual Check-in */}
      <div className="glass-card p-6 bg-white space-y-6 lg:col-span-1">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Log Manual Attendance</h3>
          <p className="text-slate-400 text-xs mt-1">Directly credit hours to volunteers for completed events.</p>
        </div>

        {volunteers.length === 0 || programs.length === 0 ? (
          <p className="text-xs text-slate-400">Loading directory listings...</p>
        ) : (
          <form onSubmit={handleManualCheckIn} className="space-y-4">
            
            {/* Select volunteer */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Select Volunteer
              </label>
              <select
                value={selectedVolId}
                onChange={(e) => setSelectedVolId(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 py-2.5 px-4 text-xs bg-white"
              >
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.displayName} ({v.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Program */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Program Event
              </label>
              <select
                value={selectedProgId}
                onChange={(e) => setSelectedProgId(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 py-2.5 px-4 text-xs bg-white"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} (+{p.xp} XP)
                  </option>
                ))}
              </select>
            </div>

            {/* Static Check in info code */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] leading-relaxed text-slate-500">
              Note: Self check-in code for all active programs is statically configured to <strong>DISHA6</strong>. Volunteers can mark themselves present by entering this code under their dashboard.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full justify-center items-center gap-2 rounded-2xl bg-primary py-2.5 px-4 text-xs font-bold text-white hover:bg-primary-hover transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <UserCheck className="h-4.5 w-4.5" />
              {submitting ? "Logging check-in..." : "Mark Present"}
            </button>

          </form>
        )}
      </div>

      {/* Attendance Logs List */}
      <div className="glass-card p-6 bg-white space-y-6 lg:col-span-2">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">System-wide Attendance Logs</h3>
          <p className="text-slate-400 text-xs mt-1">Realtime logs of all checked in volunteers across active programs.</p>
        </div>

        {loading ? (
          <div className="space-y-2 py-6">
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[20px] p-8">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-455 mb-3">
              <Clock className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No attendance registered today</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">Use the manual logger on the left or instruct volunteers to check in using their portal.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Hours</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 text-xs font-semibold">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{log.userName}</td>
                    <td className="py-3.5 px-4 text-slate-650">{log.programTitle}</td>
                    <td className="py-3.5 px-4 text-slate-500">{log.date}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{log.hours} Hrs</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </motion.div>
  );
}
