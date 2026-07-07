import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Search, X, LifeBuoy, MessageCircle, AlertCircle, Clock, CheckCircle2, User, Flag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Open");

  // Reply popup states
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "supportTickets"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => {
        // Sort Open first, then by date
        if (a.status !== b.status) return a.status === "Open" ? -1 : 1;
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      });
      setTickets(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenReplyModal = (ticket) => {
    setActiveTicket(ticket);
    setReplyText(ticket.adminReply || "");
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return toast.error("Please enter a response message");

    try {
      setSubmitting(true);
      const ticketRef = doc(db, "supportTickets", activeTicket.id);
      await updateDoc(ticketRef, {
        adminReply: replyText,
        status: "Resolved"
      });

      toast.success("Response sent and ticket status set to Resolved!");
      setActiveTicket(null);
      setReplyText("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit support response");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.volunteerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openTicketsCount = tickets.filter(t => t.status === "Open").length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 left-1/2 w-64 h-64 bg-cyan-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Support Center</span>
            </motion.div>
            

          </div>
          
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}} className="flex-shrink-0 flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col items-end border-r border-slate-200 pr-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Tickets</span>
              <span className="text-2xl font-black text-slate-800">{tickets.length}</span>
            </div>
            <div className="flex flex-col items-start pl-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Needs Action</span>
              <span className="text-2xl font-black text-rose-500">{openTicketsCount}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters & Search */}
      <motion.div variants={fadeUp} className="flex flex-col gap-3 md:flex-row md:items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md pl-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search tickets by subject, message, volunteer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full bg-transparent py-2.5 pl-10 pr-4 text-slate-800 font-semibold placeholder-slate-400 focus:outline-none text-[13px]"
          />
        </div>

        <div className="flex gap-1 pr-1 border-t border-slate-100 md:border-none pt-2 md:pt-0">
          {["Open", "Resolved", "All"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-transparent text-slate-500 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* List */}
      <div className="bg-slate-50/0 rounded-2xl">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white border border-slate-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : filteredTickets.length === 0 ? (
          <motion.div variants={fadeUp} className="text-center py-20 px-4 bg-white border border-dashed border-slate-200 rounded-3xl">
            <div className="h-16 w-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-[15px] font-bold text-slate-800">Inbox Zero!</h4>
            <p className="text-[13px] text-slate-500 mt-1">No support tickets match your search.</p>
          </motion.div>
        ) : (
          <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredTickets.map((tkt) => (
                <motion.div
                  layout
                  key={tkt.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest shadow-xs ${
                          tkt.priority === "High" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                          tkt.priority === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          "bg-slate-50 text-slate-500 border border-slate-100"
                        }`}>
                          {tkt.priority === "High" && <AlertCircle className="h-3 w-3" />}
                          {tkt.priority === "Medium" && <Flag className="h-3 w-3" />}
                          {tkt.priority}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest shadow-xs ${
                          tkt.status === "Resolved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-sky-50 text-sky-600 border border-sky-100"
                        }`}>
                          {tkt.status === "Resolved" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {tkt.status}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-[15px] leading-snug">{tkt.subject}</h4>
                      <div className="mt-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-100/80">
                        <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{tkt.message}</p>
                      </div>
                    </div>

                    {tkt.adminReply && (
                      <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
                        <span className="flex items-center gap-1.5 font-bold text-sky-700 text-[11px] uppercase tracking-wider mb-2">
                          <LifeBuoy className="h-3.5 w-3.5" /> Support Response
                        </span>
                        <p className="text-slate-700 text-[13px] font-medium leading-relaxed">{tkt.adminReply}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100 text-[11px] text-slate-400 font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-bold">{tkt.volunteerName}</span>
                        <span className="text-[10px]">{tkt.createdAt?.seconds ? new Date(tkt.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}</span>
                      </div>
                    </div>

                    {tkt.status === "Open" && (
                      <button
                        onClick={() => handleOpenReplyModal(tkt)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-sm active:scale-95 cursor-pointer font-bold"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Reply
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Reply dialog popup */}
      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTicket(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl border border-slate-100 space-y-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                    <LifeBuoy className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg">Respond to Ticket</h3>
                    <p className="text-slate-500 text-xs mt-0.5 font-medium">Ticket #{activeTicket.id.slice(0, 6)}</p>
                  </div>
                </div>
                <button onClick={() => setActiveTicket(null)} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-50">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner">
                <p className="font-extrabold text-slate-800 text-[13px]">{activeTicket.subject}</p>
                <p className="text-slate-600 mt-2 text-[13px] leading-relaxed font-medium">{activeTicket.message}</p>
              </div>

              <form onSubmit={handleSendReply} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Official Response Message *
                  </label>
                  <textarea
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="Provide resolution details..."
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all bg-white resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveTicket(null)}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-all active:scale-95 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {submitting ? "Sending..." : "Send Response"}
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
