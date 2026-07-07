import React, { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc, increment, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Check, X, FileSpreadsheet, Search, Inbox } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 bg-white space-y-6"
    >
      
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Volunteer Registrations</h3>
          <p className="text-slate-400 text-xs mt-1">Review candidates, track acceptance, and export databases.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 rounded-2xl border border-slate-200 py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
        >
          <FileSpreadsheet className="h-4.5 w-4.5 text-slate-500" />
          Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by volunteer, email or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-2xl border border-slate-200 py-2 pl-9 pr-4 text-slate-850 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["Pending", "Approved", "Rejected", "All"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-primary text-white"
                  : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3 py-6">
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[20px] p-8">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Inbox className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">No applications match your selection</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Try modifying your search keywords or switching filters to locate volunteer entries.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Volunteer</th>
                <th className="py-3 px-4">Program Applied</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 text-xs font-semibold">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-bold text-slate-800">{app.userName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{app.userEmail}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{app.programTitle}</td>
                  <td className="py-3 px-4 text-slate-500 font-medium">
                    {app.appliedAt?.seconds
                      ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString()
                      : "Recently"}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      app.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
                      app.status === "Rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {app.status === "Pending" && (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(app, "Approved")}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer"
                          title="Approve Application"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app, "Rejected")}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                          title="Reject Application"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </motion.div>
  );
}
