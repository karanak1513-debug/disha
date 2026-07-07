import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, where, addDoc, getDocs, updateDoc, doc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { CheckCircle2, UserCheck, ShieldAlert, Award } from "lucide-react";

export default function Attendance() {
  const { currentUser, userProfile } = useAuth();
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [activePrograms, setActivePrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgramId, setSelectedProgramId] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      
      {/* Check In Panel */}
      <div className="glass-card p-6 bg-white space-y-6 lg:col-span-1">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Self Check-In</h3>
          <p className="text-slate-400 text-xs mt-1">Submit attendance details using the code shared by organizers.</p>
        </div>

        {activePrograms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 p-4">
            <ShieldAlert className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No Approved Programs</p>
            <p className="text-[10px] text-slate-400 mt-1">You must be accepted into a program to record attendance.</p>
          </div>
        ) : (
          <form onSubmit={handleSelfCheckIn} className="space-y-4">
            
            {/* Select program */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Active Enrolled Program
              </label>
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-slate-800 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-sm bg-white"
              >
                {activePrograms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.hours} Hrs)
                  </option>
                ))}
              </select>
            </div>

            {/* Session Verification Code */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                placeholder="Enter DISHA6"
                className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-1.5 block">
                Ask your program manager/admin for today's check-in code.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full justify-center items-center gap-2 rounded-2xl bg-primary py-3 px-4 text-sm font-bold text-white hover:bg-primary-hover focus:outline-hidden transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <UserCheck className="h-5 w-5" />
              {submitting ? "Checking in..." : "Submit Attendance"}
            </button>

          </form>
        )}
      </div>

      {/* Attendance History */}
      <div className="glass-card p-6 bg-white space-y-6 lg:col-span-2">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Attendance Sheets</h3>
          <p className="text-slate-400 text-xs mt-1">Realtime logs of all your logged and verified community service sessions.</p>
        </div>

        {loading ? (
          <div className="space-y-3 py-6">
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : attendanceLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="h-12 w-12 text-slate-300 mb-2" />
            <span className="text-sm font-medium text-slate-400">No attendance records found.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Hours</th>
                  <th className="py-3 px-4 text-center">XP Earned</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="text-slate-700 text-xs font-semibold hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{log.programTitle}</td>
                    <td className="py-3.5 px-4 text-slate-500">{log.date}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{log.hours}</td>
                    <td className="py-3.5 px-4 text-center text-primary font-bold">
                      <div className="flex items-center justify-center gap-1">
                        <Award className="h-3.5 w-3.5 text-primary" />
                        {log.xpEarned}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100 uppercase">
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

    </div>
  );
}
