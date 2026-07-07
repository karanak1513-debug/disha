import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Bell, Plus, Trash2, X, Star, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [pinned, setPinned] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "announcements"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement broadcast?")) return;
    try {
      await deleteDoc(doc(db, "announcements", id));
      toast.success("Announcement deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete announcement");
    }
  };

  return (
    <div className="glass-card p-8 bg-white border border-slate-100/80 shadow-md rounded-[24px] space-y-8">
      
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Broadcasts & Platform News</h3>
          <p className="text-slate-500 text-xs mt-1">Publish platform notifications, pinned policy updates, or community news.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer transition-all active:scale-[0.98]"
        >
          <Plus className="h-4.5 w-4.5" />
          New Announcement
        </button>
      </div>

      {/* Main body content */}
      {loading ? (
        <div className="space-y-4 py-8">
          <div className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
          <div className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[20px] p-8">
          <div className="h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center text-primary mb-4 animate-bounce">
            <Bell className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No broadcasts published yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">Create announcements to notify volunteers about active drives, updates, or instructions.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 text-xs font-bold text-primary hover:text-primary-hover hover:underline cursor-pointer"
          >
            Create your first post →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-6 rounded-[20px] border transition-all hover:shadow-md flex flex-col justify-between min-h-[220px] ${
                ann.pinned 
                  ? "bg-orange-50/20 border-orange-200 border-t-4 border-t-primary" 
                  : "bg-white border-slate-100/90"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {ann.pinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[8px] font-extrabold text-primary uppercase tracking-wider">
                        <Star className="h-2 w-2 fill-primary" /> Pinned
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200/50 px-2 py-0.5 text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">
                      {ann.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all cursor-pointer shrink-0"
                    title="Delete Announcement"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm tracking-tight line-clamp-2" title={ann.title}>
                    {ann.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed pt-1.5 line-clamp-4" title={ann.content}>
                    {ann.content}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100/50 text-[9px] text-slate-450 font-bold justify-between">
                <span className="truncate">By {ann.author || "DISHA Admin"}</span>
                <span className="shrink-0 text-slate-400">
                  {ann.createdAt?.seconds ? new Date(ann.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publisher Dialog */}
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
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl border border-slate-100 space-y-6 z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">Create Announcement</h3>
                <p className="text-slate-500 text-xs mt-0.5 font-medium">Broadcast news or pinned alerts to all volunteers.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
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
                  className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white cursor-pointer"
                  >
                    <option value="General">General News</option>
                    <option value="Event Update">Event Update</option>
                    <option value="Platform Announcement">System Update</option>
                  </select>
                </div>

                {/* Pinned Checkbox */}
                <div className="flex items-center pt-6">
                  <label className="relative flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                      className="rounded border-slate-350 text-primary focus:ring-primary h-4.5 w-4.5 cursor-pointer accent-primary"
                    />
                    <span className="text-xs font-bold text-slate-600">Pin to top of boards</span>
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
                  className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-805 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-slate-200 hover:bg-slate-50 px-5 py-3 text-xs font-bold text-slate-600 cursor-pointer transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Publish Broadcast"}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
