import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { CheckCircle, ShieldAlert, Reply, Search, X } from "lucide-react";

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
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
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

  return (
    <div className="glass-card p-6 bg-white space-y-6">
      
      {/* Header */}
      <div>
        <h3 className="font-bold text-slate-800 text-lg">Support desk Help Tickets</h3>
        <p className="text-slate-400 text-xs mt-1">Review bug reports, clarify certification metrics, and respond to queries.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search tickets by subject, message, volunteer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-2xl border border-slate-200 py-2 pl-9 pr-4 text-slate-850 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
          />
        </div>

        <div className="flex gap-2">
          {["Open", "Resolved", "All"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-primary text-white"
                  : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3 py-4">
          <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No support tickets match your search.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((tkt) => (
            <div key={tkt.id} className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    tkt.priority === "High" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                    tkt.priority === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {tkt.priority} Priority
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm mt-1.5">{tkt.subject}</h4>
                </div>

                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                  tkt.status === "Resolved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}>
                  {tkt.status}
                </span>
              </div>

              <p className="text-xs text-slate-650 leading-relaxed whitespace-pre-wrap">{tkt.message}</p>

              {tkt.adminReply && (
                <div className="p-4 bg-white rounded-2xl border border-slate-100 text-xs leading-relaxed">
                  <span className="font-bold text-primary block">Your response:</span>
                  <p className="text-slate-600 mt-1">{tkt.adminReply}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100/60 mt-2 text-[10px] text-slate-400 font-semibold">
                <div>
                  Logged: {tkt.createdAt?.seconds ? new Date(tkt.createdAt.seconds * 1000).toLocaleDateString() : "Recently"} • By {tkt.volunteerName} ({tkt.email})
                </div>

                {tkt.status === "Open" && (
                  <button
                    onClick={() => handleOpenReplyModal(tkt)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    Reply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply dialog popup */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-800 text-base">Respond to Help Ticket</h3>
              <button onClick={() => setActiveTicket(null)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <p className="font-bold text-slate-750">{activeTicket.subject}</p>
              <p className="text-slate-500 mt-1.5">{activeTicket.message}</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Official Response Message
                </label>
                <textarea
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Provide resolution details..."
                  className="block w-full rounded-2xl border border-slate-200 py-2.5 px-4 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-2xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Sending reply..." : "Send Response"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
