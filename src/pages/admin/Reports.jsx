import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { FileSpreadsheet, Download, Users, Briefcase, Award } from "lucide-react";
import { motion } from "framer-motion";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function AdminReports() {
  const exportUsersReport = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      if (snap.empty) return toast.error("No users found to export");

      const headers = ["Name,Email,Role,XP,Hours\n"];
      const rows = snap.docs.map((doc) => {
        const u = doc.data();
        return `"${u.displayName}","${u.email}","${u.role}",${u.xp || 0},${u.hours || 0}\n`;
      });

      const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DISHA_Users_Report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success("Users CSV report downloaded!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate users report");
    }
  };

  const exportProgramsReport = async () => {
    try {
      const snap = await getDocs(collection(db, "programs"));
      if (snap.empty) return toast.error("No programs found to export");

      const headers = ["Title,Category,Location,Volunteers Limit,Enrolled,XP,Hours\n"];
      const rows = snap.docs.map((doc) => {
        const p = doc.data();
        return `"${p.title}","${p.category}","${p.location}",${p.volunteerLimit},${p.registeredCount || 0},${p.xp},${p.hours}\n`;
      });

      const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DISHA_Programs_Report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success("Programs CSV report downloaded!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate programs report");
    }
  };

  const exportCertificatesReport = async () => {
    try {
      const snap = await getDocs(collection(db, "certificates"));
      if (snap.empty) return toast.error("No certificates found to export");

      const headers = ["Certificate Number,Volunteer Name,Program,Hours Logged,Issued Date\n"];
      const rows = snap.docs.map((doc) => {
        const c = doc.data();
        return `"${c.certificateNumber}","${c.userName}","${c.programTitle}",${c.hours},"${c.issuedAt?.seconds ? new Date(c.issuedAt.seconds * 1000).toLocaleDateString() : "Recently"}"\n`;
      });

      const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DISHA_Certificates_Report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast.success("Certificates CSV report downloaded!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate certificates report");
    }
  };

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
            className="absolute top-10 left-1/2 w-64 h-64 bg-violet-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Reports</span>
            </motion.div>
            

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Users report */}
        <motion.div variants={fadeUp} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-6 group">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-blue-100 text-emerald-600 mb-5 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Volunteer Registry</h4>
            <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">Contains personal metrics, service hours logged, and accumulated XP points.</p>
          </div>
          <button
            onClick={exportUsersReport}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-white border border-slate-200 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </motion.div>

        {/* Programs report */}
        <motion.div variants={fadeUp} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-6 group">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 mb-5 group-hover:scale-110 transition-transform">
              <Briefcase className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Campaign Performance</h4>
            <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">Contains categories, registration limit caps, and attendance percentages.</p>
          </div>
          <button
            onClick={exportProgramsReport}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-white border border-slate-200 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:text-violet-600 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </motion.div>

        {/* Certificates report */}
        <motion.div variants={fadeUp} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-6 group">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mb-5 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-lg">Issued Credentials</h4>
            <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">Contains issued security certificates, verification hashes, and dates.</p>
          </div>
          <button
            onClick={exportCertificatesReport}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-white border border-slate-200 py-3 text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}
