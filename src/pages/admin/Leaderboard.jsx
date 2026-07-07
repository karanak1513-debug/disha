import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Trophy, Plus, Trash2, Edit2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLeaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);

  // Form inputs
  const [displayName, setDisplayName] = useState("");
  const [xp, setXp] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "leaderboard"), orderBy("xp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaders(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    setEditingLeader(null);
    setDisplayName("");
    setXp(0);
    setHours(0);
    setShowModal(true);
  };

  const openEditModal = (leader) => {
    setEditingLeader(leader);
    setDisplayName(leader.displayName || "");
    setXp(leader.xp || 0);
    setHours(leader.hours || 0);
    setShowModal(true);
  };

  const handleSaveLeader = async (e) => {
    e.preventDefault();
    if (!displayName) return toast.error("Please enter a name");

    const payload = {
      displayName,
      xp: Number(xp),
      hours: Number(hours),
    };

    try {
      if (editingLeader) {
        await updateDoc(doc(db, "leaderboard", editingLeader.id), payload);
        toast.success("Leaderboard entry updated successfully!");
      } else {
        await addDoc(collection(db, "leaderboard"), payload);
        toast.success("Leaderboard entry added successfully!");
      }
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save entry");
    }
  };

  const handleDeleteLeader = async (id) => {
    if (!window.confirm("Delete this leaderboard entry?")) return;
    try {
      await deleteDoc(doc(db, "leaderboard", id));
      toast.success("Leaderboard entry deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete entry");
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
          <h3 className="font-bold text-slate-800 text-lg">Configure Hall of Fame</h3>
          <p className="text-slate-400 text-xs mt-1">Audit or add custom rankings for national volunteer stats.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-md cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Entry
        </button>
      </div>

      {loading ? (
        <div className="space-y-2 py-4">
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : leaders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[20px] p-8">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Trophy className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">Leaderboard is empty</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">No custom ranks added. Add entries above or run database seeding to populate volunteer leaderboards.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Volunteer</th>
                <th className="py-3 px-4 text-center">XP Points</th>
                <th className="py-3 px-4 text-center">Hours Served</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 text-xs font-semibold">
              {leaders.map((leader, idx) => (
                <tr key={leader.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-bold text-[10px] text-slate-655">
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{leader.displayName}</td>
                  <td className="py-3 px-4 text-center text-primary font-black">{leader.xp} XP</td>
                  <td className="py-3 px-4 text-center text-slate-600">{leader.hours} Hrs</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(leader)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLeader(leader.id)}
                        className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal */}
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
                <h3 className="font-extrabold text-slate-805 text-base tracking-tight">
                  {editingLeader ? "Edit Rank Score" : "Add Custom Rank Score"}
                </h3>
                <p className="text-slate-550 text-xs mt-0.5 font-medium font-semibold">Audit or append custom rankings for national volunteer stats.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} className="space-y-4">
              
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Diya Patel"
                  className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">XP points</label>
                <input
                  type="number"
                  value={xp}
                  onChange={(e) => setXp(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hours served</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer transition-all active:scale-[0.98]"
                >
                  Save Entry
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
