import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Bell, Search, Star, Inbox, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    const q = query(collection(db, "announcements"), orderBy("pinned", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAnnouncements = announcements.filter((a) =>
    a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedCount = announcements.filter(a => a.pinned).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto md:min-h-[100px] flex items-center relative overflow-hidden">
        {/* Subtle animated background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 right-1/4 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          {/* Left Column */}
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <Link to="/dashboard" className="hover:text-slate-800 transition-colors">Volunteer</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Announcements</span>
            </motion.div>
            

          </div>

          {/* Right Column: Actions & Stats */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Bell className="h-3 w-3" /> Total
                </span>
                <span className="text-lg font-black text-slate-800 leading-none mt-1">{announcements.length}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-2" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest flex items-center gap-1">
                  <Star className="h-3 w-3" /> Pinned
                </span>
                <span className="text-lg font-black text-blue-600 leading-none mt-1">{pinnedCount}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BENTO BOX CONTAINER ── */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Header toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Megaphone className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Platform Announcements</h3>
              <p className="text-[10px] text-slate-500 font-medium">Stay updated with DISHA</p>
            </div>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block pl-9 p-2.5 transition-all outline-none"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50/30">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white border border-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-slate-200 rounded-xl">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <Inbox className="h-7 w-7 text-slate-300" />
              </div>
              <p className="font-bold text-slate-600 text-sm mb-1">
                {searchQuery ? "No matching announcements" : "No announcements yet"}
              </p>
              <p className="text-slate-400 text-xs">
                {searchQuery ? "Try a different search term." : "Check back later for updates from admins."}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAnnouncements.map((ann, idx) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`relative flex flex-col justify-between p-5 rounded-2xl border bg-white transition-shadow hover:shadow-lg cursor-default overflow-hidden ${
                    ann.pinned
                      ? "border-blue-200 shadow-sm"
                      : "border-slate-200 shadow-sm"
                  }`}
                >
                  {ann.pinned && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                  )}
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {ann.pinned && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[9px] font-black text-blue-600 uppercase tracking-wider">
                          <Star className="h-2.5 w-2.5 fill-blue-600" /> Pinned
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                        {ann.category || "General"}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">
                        {ann.title}
                      </h4>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed mt-2 line-clamp-3">
                        {ann.content}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-bold justify-between">
                    <span className="truncate text-slate-500">By {ann.author || "Admin"}</span>
                    <span className="shrink-0">
                      {ann.createdAt?.seconds 
                        ? new Date(ann.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', year: 'numeric'
                          }) 
                        : "Recently"}
                    </span>
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
