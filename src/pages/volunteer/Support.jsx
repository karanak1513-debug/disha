import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { LifeBuoy, Send, ShieldAlert, CheckCircle, Search, MessageSquare, AlertCircle, FileText, Clock, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Support() {
  const { currentUser, userProfile } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
    if (!currentUser) return;

    const q = query(
      collection(db, "supportTickets"),
      where("email", "==", currentUser.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setTickets(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!subject || !message) return toast.error("Please enter a subject and detailed message");

    try {
      setSubmitting(true);
      await addDoc(collection(db, "supportTickets"), {
        subject,
        category,
        priority,
        message,
        status: "Open",
        volunteerName: userProfile?.displayName || currentUser.displayName || "Volunteer",
        email: currentUser.email,
        createdAt: serverTimestamp()
      });

      toast.success("Support ticket created. Support staff will respond soon!");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openTicketsCount = tickets.filter(t => t.status === "Open" || t.status === "In Progress").length;
  const resolvedTicketsCount = tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length;

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
              <Link to="/dashboard" className="hover:text-slate-800 transition-colors">Account</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Support Center</span>
            </motion.div>
            

          </div>

          {/* Right Column: Actions & Stats */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Open
                </span>
                <span className="text-lg font-black text-slate-800 leading-none mt-1">{openTicketsCount}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-2" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Resolved
                </span>
                <span className="text-lg font-black text-slate-800 leading-none mt-1">{resolvedTicketsCount}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Create Ticket */}
        <motion.div variants={fadeUp} className="lg:col-span-1">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-blue-100 flex items-center justify-center">
                <LifeBuoy className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Raise a Ticket</h3>
                <p className="text-[10px] text-slate-500 font-medium">Submit a new request</p>
              </div>
            </div>
            
            <form onSubmit={handleCreateTicket} className="p-6 bg-white space-y-5 flex-1">
              
              {/* Category */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                  Issue Category
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <FileText className="h-4 w-4" />
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 transition-all outline-none font-medium appearance-none"
                  >
                    <option value="General">General Query</option>
                    <option value="Attendance">Attendance & Hours</option>
                    <option value="Certificates">Certificates Generation</option>
                    <option value="Platform Bug">Platform Issue/Bug</option>
                  </select>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                  Urgency
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                    <AlertCircle className="h-4 w-4" />
                  </span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 transition-all outline-none font-medium appearance-none"
                  >
                    <option value="Low">Low - Casual query</option>
                    <option value="Medium">Medium - Normal assistance</option>
                    <option value="High">High - Urgent issue</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. XP points not credited"
                  className="block w-full rounded-xl border border-slate-200 py-2.5 px-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 transition-all outline-none font-medium"
                />
              </div>

              {/* Detailed Message */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please provide details about the issue..."
                  rows={5}
                  className="block w-full rounded-xl border border-slate-200 py-2.5 px-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 transition-all outline-none font-medium resize-none"
                />
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="flex w-full justify-center items-center gap-2 rounded-xl bg-[#0A2540] py-3 px-4 text-sm font-bold text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Filing Query..." : "Submit Ticket"}
                </motion.button>
              </div>

            </form>
          </div>
        </motion.div>

        {/* Right Column: Ticket History */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Ticket className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">My Help Tickets</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Track your recent requests</p>
                </div>
              </div>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block pl-9 p-2.5 transition-all outline-none"
                />
              </div>
            </div>

            <div className="p-0 bg-slate-50/30 flex-1">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-32 bg-white border border-slate-100 rounded-xl animate-pulse" />)}
                </div>
              ) : filteredTickets.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
                    <LifeBuoy className="h-7 w-7 text-slate-300" />
                  </div>
                  <p className="font-bold text-slate-600 text-sm mb-1">
                    {searchQuery ? "No matching tickets" : "No support tickets found"}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {searchQuery ? "Try a different search term." : "Need help? File a ticket from the left panel."}
                  </p>
                </motion.div>
              ) : (
                <div className="p-5 space-y-4">
                  {filteredTickets.map((tkt, idx) => (
                    <motion.div
                      key={tkt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all flex flex-col space-y-4 cursor-default"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 text-sm leading-tight">{tkt.subject}</h4>
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold text-slate-500 border border-slate-200 uppercase tracking-wider">
                            {tkt.category}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm ${
                          tkt.status === "Resolved" || tkt.status === "Closed"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                          {tkt.status === "Resolved" || tkt.status === "Closed" ? <CheckCircle className="h-3 w-3 shrink-0" /> : <ShieldAlert className="h-3 w-3 shrink-0" />}
                          {tkt.status}
                        </span>
                      </div>

                      <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed font-medium">
                        {tkt.message}
                      </div>

                      {tkt.adminReply && (
                        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-xs leading-relaxed relative">
                          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl" />
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-indigo-600" />
                            <span className="font-bold text-indigo-700 tracking-tight">Support Team Response</span>
                          </div>
                          <p className="text-slate-700 font-medium pl-5">{tkt.adminReply}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5" />
                          Priority: {tkt.priority}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Logged: {tkt.createdAt?.seconds ? new Date(tkt.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
