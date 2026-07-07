import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, increment, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Award, Plus, Search, ShieldCheck, X, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 bg-white space-y-6"
    >
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Certificates Center</h3>
          <p className="text-slate-400 text-xs mt-1">Issue official, verified certificates of appreciation with security numbers.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-md cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Issue Certificate
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 py-6">
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : certs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[20px] p-8">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Award className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">No certificates generated yet</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">Create and digitally sign official appreciation credentials for active volunteers.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Volunteer</th>
                <th className="py-3 px-4">Program Campaign</th>
                <th className="py-3 px-4 text-center">Hours Credited</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 text-xs font-semibold">
              {certs.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-850">{cert.certificateNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{cert.userName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{cert.programTitle}</td>
                  <td className="py-3.5 px-4 text-center text-slate-500 font-bold">{cert.hours} Hrs</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-100 uppercase">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(cert)}
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 transition-colors cursor-pointer"
                        title="Edit Certificate"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => triggerDeleteConfirm(cert.id)}
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-colors cursor-pointer"
                        title="Delete Certificate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generator Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl border border-slate-100 space-y-6 z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-805 text-lg tracking-tight">Issue Verified Certificate</h3>
                <p className="text-slate-550 text-xs mt-0.5 font-medium font-semibold">Generate credential with secure digital signature hash.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            {volunteers.length === 0 || programs.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold text-center py-4">Loading listings directories...</p>
            ) : (
              <form onSubmit={handleGenerateCertificate} className="space-y-4">
                
                {/* Select volunteer */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Volunteer</label>
                  <select
                    value={selectedVolId}
                    onChange={(e) => setSelectedVolId(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white cursor-pointer"
                  >
                    {volunteers.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Program */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Program Campaign</label>
                  <select
                    value={selectedProgId}
                    onChange={(e) => setSelectedProgId(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-805 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white cursor-pointer"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hours */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hours to Log on Certificate</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-805 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-655 hover:bg-slate-50 cursor-pointer transition-colors active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
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
