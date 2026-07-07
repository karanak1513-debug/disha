import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Award, Plus, ShieldCheck, X, Edit2, Trash2, Clock, User, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function AdminCertificates() {
  const [certs, setCerts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [certToDeleteId, setCertToDeleteId] = useState(null);

  // Form states
  const [selectedVolId, setSelectedVolId] = useState("");
  const [selectedProgId, setSelectedProgId] = useState("");
  const [hours, setHours] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // 1. Fetch certificates
    const unsubCerts = onSnapshot(collection(db, "certificates"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (b.issuedAt?.seconds || 0) - (a.issuedAt?.seconds || 0));
      setCerts(data);
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
      setPrograms(data);
    });

    return () => {
      unsubCerts();
      unsubVolunteers();
      unsubProgs();
    };
  }, []);

  // Update default states
  useEffect(() => {
    if (volunteers.length > 0 && !selectedVolId) setSelectedVolId(volunteers[0].id);
    if (programs.length > 0 && !selectedProgId) setSelectedProgId(programs[0].id);
  }, [volunteers, programs]);

  const openCreateModal = () => {
    setEditingCert(null);
    setHours(10);
    if (volunteers.length > 0) setSelectedVolId(volunteers[0].id);
    if (programs.length > 0) setSelectedProgId(programs[0].id);
    setShowModal(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setSelectedVolId(cert.userId);
    setSelectedProgId(cert.programId);
    setHours(cert.hours);
    setShowModal(true);
  };

  const triggerDeleteConfirm = (certId) => {
    setCertToDeleteId(certId);
    setConfirmDeleteOpen(true);
  };

  const executeDeleteCert = async () => {
    if (!certToDeleteId) return;
    const cert = certs.find(c => c.id === certToDeleteId);
    if (!cert) return;
    try {
      await deleteDoc(doc(db, "certificates", certToDeleteId));
      
      const volRef = doc(db, "users", cert.userId);
      await updateDoc(volRef, {
        certificatesCount: increment(-1)
      });
      
      toast.success("Certificate deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete certificate");
    } finally {
      setCertToDeleteId(null);
    }
  };

  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    if (!selectedVolId || !selectedProgId) {
      return toast.error("Please select a volunteer and program campaign");
    }

    const volunteer = volunteers.find(v => v.id === selectedVolId);
    const program = programs.find(p => p.id === selectedProgId);

    if (!volunteer || !program) return toast.error("Invalid mapping selection");

    // If editing, skip the "already issued" check since it already exists
    if (editingCert) {
      try {
        setSubmitting(true);
        const certRef = doc(db, "certificates", editingCert.id);
        await updateDoc(certRef, {
          userId: selectedVolId,
          userName: volunteer.displayName || "Volunteer",
          programId: selectedProgId,
          programTitle: program.title,
          hours: Number(hours)
        });
        toast.success("Certificate updated successfully!");
        setShowModal(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to update certificate");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Check if certificate already exists for new ones
    const alreadyIssued = certs.some(
      (c) => c.userId === selectedVolId && c.programId === selectedProgId
    );

    if (alreadyIssued) {
      return toast.error("A certificate for this volunteer for this program has already been generated");
    }

    try {
      setSubmitting(true);
      const uniqueNumber = `DISHA-2026-${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Create certificate entry
      await addDoc(collection(db, "certificates"), {
        userId: selectedVolId,
        userName: volunteer.displayName || "Volunteer",
        programId: selectedProgId,
        programTitle: program.title,
        hours: Number(hours),
        certificateNumber: uniqueNumber,
        issuedAt: serverTimestamp()
      });

      // 2. Increment user certificate count
      const volRef = doc(db, "users", selectedVolId);
      await updateDoc(volRef, {
        certificatesCount: increment(1)
      });

      // 3. Add notification
      await addDoc(collection(db, "notifications"), {
        userId: selectedVolId,
        title: "New Certificate Issued!",
        message: `Admin has issued you an appreciation certificate for '${program.title}'. Download it from the Certificates tab!`,
        read: false,
        createdAt: serverTimestamp()
      });

      toast.success("Certificate issued successfully!");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate certificate");
    } finally {
      setSubmitting(false);
    }
  };

  const recentlyIssuedCount = certs.filter(c => {
    if (!c.issuedAt) return true;
    const diff = (Date.now() / 1000) - c.issuedAt.seconds;
    return diff < 604800; // less than a week
  }).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 left-1/2 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Certificates</span>
            </motion.div>
            

          </div>
          
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}} className="flex-shrink-0 flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col items-end border-r border-slate-200 pr-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Issued</span>
              <span className="text-2xl font-black text-slate-800">{certs.length}</span>
            </div>
            <div className="flex flex-col items-start pr-4 border-r border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Past Week</span>
              <span className="text-2xl font-black text-purple-600">{recentlyIssuedCount}</span>
            </div>
            <button
              onClick={openCreateModal}
              className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="h-6 w-6" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── BENTO BOX CONTAINER ── */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Box Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Issued Certificates Registry</h3>
              <p className="text-[11px] text-slate-500 font-medium">Manage and review all digital credentials</p>
            </div>
          </div>
        </div>

        {/* Table / List */}
        <div className="bg-white">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : certs.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="h-16 w-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No certificates generated yet</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm font-medium">Create and digitally sign official appreciation credentials for active volunteers.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                    <th className="py-4 px-6">Certificate ID</th>
                    <th className="py-4 px-6">Volunteer</th>
                    <th className="py-4 px-6">Program Campaign</th>
                    <th className="py-4 px-6 text-center">Hours Credited</th>
                    <th className="py-4 px-6">Verification</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-semibold">
                  <AnimatePresence>
                    {certs.map((cert) => (
                      <motion.tr 
                        key={cert.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-800 text-[13px]">{cert.certificateNumber}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black bg-slate-50 border border-slate-200 text-slate-600 shadow-sm">
                              {cert.userName?.charAt(0) || "?"}
                            </div>
                            <span className="font-bold text-slate-800">{cert.userName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {cert.programTitle}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 shadow-xs">
                            <Clock className="h-3 w-3 text-orange-400" />
                            {cert.hours}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border shadow-xs bg-emerald-50 border-emerald-100 text-emerald-700 uppercase tracking-wider">
                            <ShieldCheck className="h-3 w-3" />
                            Verified
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(cert)}
                              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-purple-50 hover:border-purple-200 text-slate-400 hover:text-purple-600 shadow-sm transition-all cursor-pointer active:scale-95"
                              title="Edit Certificate"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => triggerDeleteConfirm(cert.id)}
                              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 shadow-sm transition-all cursor-pointer active:scale-95"
                              title="Delete Certificate"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
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

      {/* Generator Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl border border-slate-100 space-y-6 z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-2">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Issue Verified Certificate</h3>
                <p className="text-slate-500 text-xs mt-1 font-medium">Generate credential with secure digital signature hash.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            {volunteers.length === 0 || programs.length === 0 ? (
              <p className="text-[13px] text-slate-400 font-bold text-center py-6">Loading listings directories...</p>
            ) : (
              <form onSubmit={handleGenerateCertificate} className="space-y-5">
                
                {/* Select volunteer */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Select Volunteer</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      value={selectedVolId}
                      onChange={(e) => setSelectedVolId(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-[13px] font-semibold text-slate-800 bg-slate-50/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                    >
                      {volunteers.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.displayName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Select Program */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Program Campaign</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                    </div>
                    <select
                      value={selectedProgId}
                      onChange={(e) => setSelectedProgId(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-[13px] font-semibold text-slate-800 bg-slate-50/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hours */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hours to Log on Certificate</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Clock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="block w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-[13px] font-semibold text-slate-800 bg-slate-50/50 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-purple-600 hover:bg-purple-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {submitting ? "Generating..." : "Generate & Sign"}
                  </button>
                </div>

              </form>
            )}
          </motion.div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={executeDeleteCert}
        title="Revoke Certificate"
        message="Are you sure you want to permanently revoke this volunteer certificate? This will decrement the volunteer's credential count."
      />
    </motion.div>
  );
}
