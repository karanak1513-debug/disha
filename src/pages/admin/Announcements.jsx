import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Bell, Plus, Trash2, X, Star, Megaphone } from "lucide-react";
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

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [annToDeleteId, setAnnToDeleteId] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [pinned, setPinned] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "announcements"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => {
        if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });
      setAnnouncements(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!title || !content) return toast.error("Please enter a title and description content");

    try {
      setSubmitting(true);
      await addDoc(collection(db, "announcements"), {
        title,
        category,
        pinned,
        content,
        author: "DISHA Admin",
        createdAt: serverTimestamp()
      });

      toast.success("Broadcast published successfully!");
      setShowModal(false);
      setTitle("");
      setContent("");
      setPinned(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to post announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeleteConfirm = (id) => {
    setAnnToDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!annToDeleteId) return;
    try {
      await deleteDoc(doc(db, "announcements", annToDeleteId));
      toast.success("Announcement deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete announcement");
    } finally {
      setAnnToDeleteId(null);
      setConfirmDeleteOpen(false);
    }
  };

  const pinnedCount = announcements.filter(a => a.pinned).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 left-1/2 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Announcements</span>
            </motion.div>
            

          </div>
          
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}} className="flex-shrink-0 flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col items-end border-r border-slate-200 pr-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Posts</span>
              <span className="text-2xl font-black text-slate-800">{announcements.length}</span>
            </div>
            <div className="flex flex-col items-start pr-4 border-r border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pinned</span>
              <span className="text-2xl font-black text-orange-600">{pinnedCount}</span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-orange-600 text-white hover:bg-orange-700 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="h-6 w-6" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main body content */}
      <div className="bg-slate-50/0 rounded-2xl">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-[220px] bg-slate-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : announcements.length === 0 ? (
          <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-dashed border-slate-200 rounded-3xl p-8">
            <div className="h-16 w-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-4 animate-bounce">
              <Megaphone className="h-7 w-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No broadcasts published yet</h4>
            <p className="text-[13px] text-slate-500 mt-1 max-w-sm">Create announcements to notify volunteers about active drives, updates, or instructions.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 px-5 py-2.5 rounded-xl bg-orange-50 border border-orange-100 text-[13px] font-bold text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              Create your first post
            </button>
          </motion.div>
        ) : (
          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {announcements.map((ann) => (
                <motion.div
                  key={ann.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-6 rounded-3xl border transition-all hover:shadow-md flex flex-col justify-between min-h-[220px] group ${
                    ann.pinned 
                      ? "bg-white border-orange-200 shadow-sm relative overflow-hidden" 
                      : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                >
                  {ann.pinned && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-500" />
                  )}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {ann.pinned && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-[9px] font-extrabold text-orange-600 border border-orange-100 uppercase tracking-widest shadow-xs">
                            <Star className="h-2.5 w-2.5 fill-orange-600 text-orange-600" /> Pinned
                          </span>
                        )}
                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-[9px] font-extrabold text-slate-600 border border-slate-100 uppercase tracking-widest shadow-xs">
                          {ann.category}
                        </span>
                      </div>
                      <button
                        onClick={() => triggerDeleteConfirm(ann.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 shadow-sm transition-all cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 active:scale-95"
                        title="Delete Announcement"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-lg tracking-tight line-clamp-2 leading-snug" title={ann.title}>
                        {ann.title}
                      </h4>
                      <p className="text-[13px] font-medium text-slate-500 leading-relaxed pt-2 line-clamp-4" title={ann.content}>
                        {ann.content}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider justify-between">
                    <span className="truncate">By {ann.author || "DISHA Admin"}</span>
                    <span className="shrink-0 text-slate-400">
                      {ann.createdAt?.seconds ? new Date(ann.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Publisher Dialog */}
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Create Announcement</h3>
                <p className="text-slate-500 text-xs mt-1 font-medium">Broadcast news or pinned alerts to all volunteers.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-5">
              
              {/* Subject Title */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Clean-up drive rescheduled for Saturday"
                  className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 bg-slate-50/50 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                  >
                    <option value="General">General News</option>
                    <option value="Event Update">Event Update</option>
                    <option value="Platform Announcement">System Update</option>
                  </select>
                </div>

                {/* Pinned Checkbox */}
                <div className="flex items-center pt-6">
                  <label className="relative flex items-center gap-3 cursor-pointer select-none">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={pinned}
                        onChange={(e) => setPinned(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-slate-50 checked:border-orange-600 checked:bg-orange-600 transition-all"
                      />
                      <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-[13px] font-bold text-slate-700">Pin to top of boards</span>
                  </label>
                </div>

              </div>

              {/* Detailed Message */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Detailed Message *</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Explain event details, updates, or announcements clearly..."
                  className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 bg-slate-50/50 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
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
                  className="rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  {submitting ? "Publishing..." : "Publish Broadcast"}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
      
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={executeDelete}
        title="Delete Announcement"
        message="Are you sure you want to permanently delete this announcement? This action cannot be undone."
      />

    </motion.div>
  );
}
