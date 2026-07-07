import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Bell, Search, Clock, Star, User, Inbox } from "lucide-react";
import { motion } from "framer-motion";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-8 bg-white border border-slate-100/80 shadow-md rounded-[24px] space-y-8"
    >
      
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-extrabold text-slate-805 tracking-tight flex items-center gap-2">
            <Bell className="h-5.5 w-5.5 text-primary" />
            Platform Announcements
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Realtime updates and notifications regarding active volunteering drives.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-2xl border border-slate-200 py-3.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all text-xs font-semibold bg-white"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="space-y-4 py-4">
          <div className="h-24 bg-slate-50 rounded-[20px] animate-pulse" />
          <div className="h-24 bg-slate-50 rounded-[20px] animate-pulse" />
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[20px] p-8">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Inbox className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">No announcements found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">No notifications match your search terms or exist at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnnouncements.map((ann) => (
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
                      {ann.category || "General"}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm tracking-tight line-clamp-2" title={ann.title}>
                    {ann.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-550 leading-relaxed pt-1.5 line-clamp-4" title={ann.content}>
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

    </motion.div>
  );
}
