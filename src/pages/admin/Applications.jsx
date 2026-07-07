import React, { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc, increment, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Check, X, FileSpreadsheet, Search, Inbox, FileText, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Pending");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "applications"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort application dates locally
      data.sort((a, b) => (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0));
      setApplications(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (app, nextStatus) => {
    try {
      // 1. Update application status
      const appRef = doc(db, "applications", app.id);
      await updateDoc(appRef, { status: nextStatus });

      // 2. If approved, increment program count and notify user
      if (nextStatus === "Approved") {
        const progRef = doc(db, "programs", app.programId);
        await updateDoc(progRef, {
          registeredCount: increment(1)
        });

        // Notify user
        await addDoc(collection(db, "notifications"), {
          userId: app.userId,
          title: "Application Accepted!",
          message: `Congratulations! Your application to participate in '${app.programTitle}' has been approved.`,
          read: false,
          createdAt: serverTimestamp()
        });
      } else if (nextStatus === "Rejected") {
        // Notify user
        await addDoc(collection(db, "notifications"), {
          userId: app.userId,
          title: "Application Status Update",
          message: `We regret to inform you that your application for '${app.programTitle}' was not approved at this time.`,
          read: false,
          createdAt: serverTimestamp()
        });
      }

      toast.success(`Application set to ${nextStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const handleExportCSV = () => {
    if (applications.length === 0) return toast.error("No applications to export");
    const headers = ["Volunteer Name,Volunteer Email,Program,Status,Applied On\n"];
    const rows = applications.map(
      (a) =>
        `"${a.userName}","${a.userEmail}","${a.programTitle}","${a.status}","${
          a.appliedAt?.seconds
            ? new Date(a.appliedAt.seconds * 1000).toLocaleDateString()
            : "Recently"
        }"\n`
    );
    const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `DISHA_Applications_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success("CSV file downloaded!");
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.programTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = applications.filter(a => a.status === "Pending").length;
  const approvedCount = applications.filter(a => a.status === "Approved").length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 left-1/2 w-64 h-64 bg-fuchsia-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Applications</span>
            </motion.div>
            

          </div>
          
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}} className="flex-shrink-0 flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col items-end border-r border-slate-200 pr-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pending</span>
              <span className="text-2xl font-black text-amber-500">{pendingCount}</span>
            </div>
            <div className="flex flex-col items-start pl-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Approved</span>
              <span className="text-2xl font-black text-emerald-600">{approvedCount}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BENTO BOX CONTAINER ── */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Box Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Applications List</h3>
              <p className="text-[11px] text-slate-500 font-medium">Manage and review volunteer entries</p>
            </div>
          </div>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-blue-500" />
            Export CSV
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by volunteer, email or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-xs font-medium shadow-sm transition-all bg-slate-50/50"
            />
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-100/70 border border-slate-200/60 rounded-xl overflow-x-auto no-scrollbar">
            {["Pending", "Approved", "Rejected", "All"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filterStatus === status
                    ? "bg-white text-violet-700 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table / List */}
        <div className="bg-white">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold gap-3">
              <div className="h-16 w-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-2">
                <Inbox className="h-6 w-6 text-slate-300" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No applications match your selection</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm text-center">Try modifying your search keywords or switching filters to locate volunteer entries.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                    <th className="py-4 px-6">Volunteer</th>
                    <th className="py-4 px-6">Program Applied</th>
                    <th className="py-4 px-6">Applied Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-semibold">
                  <AnimatePresence>
                    {filteredApps.map((app) => (
                      <motion.tr 
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black bg-slate-50 border border-slate-200 text-slate-600 shadow-sm">
                              {app.userName?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-[13px]">{app.userName}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{app.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-700">{app.programTitle}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {app.appliedAt?.seconds
                              ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString()
                              : "Recently"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold border shadow-xs ${
                            app.status === "Approved" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                            app.status === "Rejected" ? "bg-rose-50 border-rose-100 text-rose-700" : 
                            "bg-amber-50 border-amber-100 text-amber-700"
                          }`}>
                            {app.status === "Approved" ? "✓ " : app.status === "Pending" ? "⏳ " : "✕ "}{app.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {app.status === "Pending" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdateStatus(app, "Approved")}
                                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-slate-400 hover:text-emerald-600 shadow-sm transition-all cursor-pointer active:scale-95"
                                title="Approve Application"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app, "Rejected")}
                                className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 shadow-sm transition-all cursor-pointer active:scale-95"
                                title="Reject Application"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <div className="p-2 rounded-xl bg-slate-50 text-slate-300 border border-transparent">
                                <CheckCircle2 className="h-4 w-4" />
                              </div>
                            </div>
                          )}
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
    </motion.div>
  );
}
