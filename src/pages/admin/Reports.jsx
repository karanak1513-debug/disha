import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { FileSpreadsheet, Download } from "lucide-react";

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
    <div className="glass-card p-6 bg-white space-y-6">
      
      <div>
        <h3 className="font-bold text-slate-800 text-lg">System Reports Center</h3>
        <p className="text-slate-400 text-xs mt-1">Generate and export system-wide volunteer and campaign logs for audits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Users report */}
        <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Volunteer Registry Report</h4>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">Contains personal metrics, service hours logged, and accumulated XP points.</p>
          </div>
          <button
            onClick={exportUsersReport}
            className="flex items-center justify-center gap-1.5 w-full rounded-2xl bg-white border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </div>

        {/* Programs report */}
        <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Campaign Performance Report</h4>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">Contains categories, registration limit caps, and attendance percentages.</p>
          </div>
          <button
            onClick={exportProgramsReport}
            className="flex items-center justify-center gap-1.5 w-full rounded-2xl bg-white border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </div>

        {/* Certificates report */}
        <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Issued Credentials Report</h4>
            <p className="text-[10px] text-slate-500 mt-1 leading-normal">Contains issued security certificates, verification hashes, and dates.</p>
          </div>
          <button
            onClick={exportCertificatesReport}
            className="flex items-center justify-center gap-1.5 w-full rounded-2xl bg-white border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </div>

      </div>

    </div>
  );
}
