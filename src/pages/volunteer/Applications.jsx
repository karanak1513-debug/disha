import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FileQuestion, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function Applications() {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="glass-card p-6 bg-white space-y-6">
      <div>
        <h3 className="font-bold text-slate-800 text-lg">My Applications</h3>
        <p className="text-slate-400 text-xs mt-1">Track the status of your submitted applications to programs.</p>
      </div>

      {loading ? (
        <div className="space-y-3 py-6">
          <div className="h-12 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileQuestion className="h-12 w-12 text-slate-300 mb-2" />
          <span className="text-sm font-medium text-slate-400">No applications filed yet.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Submitted On</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {applications.map((app) => (
                <tr key={app.id} className="text-slate-700 text-xs font-semibold hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{app.programTitle}</td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {app.appliedAt?.seconds
                      ? new Date(app.appliedAt.seconds * 1000).toLocaleDateString()
                      : "Recently"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
