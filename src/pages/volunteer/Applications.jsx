import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FileQuestion, CheckCircle2, XCircle, Clock, FileText, Check, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Applications() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
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

    const q = query(
      collection(db, "applications"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort application dates locally since compound indexes take time to build
      data.sort((a, b) => (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0));
      setApplications(data);
      setLoading(false);
    }, (error) => {
      console.error("Applications loading error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredApps = applications.filter(app => 
    app.programTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approvedCount = applications.filter(a => a.status === "Approved").length;
  const pendingCount = applications.filter(a => a.status === "Pending").length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E2E8F0] px-6 md:px-8 py-8 h-auto md:min-h-[100px] flex items-center relative overflow-hidden">
        <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          {/* Left Column */}
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <Link to="/dashboard" className="hover:text-slate-800 transition-colors">Volunteer</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">My Applications</span>
            </motion.div>
            

          </div>

          {/* Right Column: Actions & Stats */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-lg font-black text-slate-800 leading-none">{applications.length}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-1" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest">Approved</span>
                <span className="text-lg font-black text-emerald-600 leading-none">{approvedCount}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-1" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest">Pending</span>
                <span className="text-lg font-black text-amber-600 leading-none">{pendingCount}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BENTO BOX CONTAINER ── */}
      <motion.div variants={fadeUp} className="rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
        {/* Header toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Application History</h3>
              <p className="text-[10px] text-slate-500 font-medium">View and manage your requests</p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] block pl-9 p-2.5 transition-all outline-none"
            />
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : filteredApps.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <FileQuestion className="h-7 w-7 text-slate-300" />
              </div>
              <p className="font-bold text-slate-600 text-sm mb-1">
                {searchTerm ? "No matching applications found" : "No applications filed yet"}
              </p>
              <p className="text-slate-400 text-xs mb-5">
                {searchTerm ? "Try a different search term." : "Join a campaign and make an impact!"}
              </p>
              {!searchTerm && (
                <Link to="/programs" className="inline-flex items-center gap-2 bg-[#0A2540] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-sm">
                  Explore Programs
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredApps.map((app, idx) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-[#E2E8F0] rounded-[12px] p-5 hover:border-slate-300 transition-colors flex flex-col gap-4 relative group shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-black">
                        {app.programTitle?.charAt(0)?.toUpperCase() || "P"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{app.programTitle}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {app.appliedAt?.seconds
                            ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      app.status === "Approved"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : app.status === "Rejected"
                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {app.status === "Approved" && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                      {app.status === "Rejected" && <XCircle className="h-3 w-3 shrink-0" />}
                      {app.status === "Pending" && <Clock className="h-3 w-3 shrink-0" />}
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="pt-4 mt-auto border-t border-[#E2E8F0]">
                    <Link to="/programs" className="w-full flex items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#0A2540] text-xs font-semibold py-2 rounded-lg transition-colors border border-[#E2E8F0]">
                      View Details
                    </Link>
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
