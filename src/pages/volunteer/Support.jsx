import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { LifeBuoy, Send, ShieldAlert, CheckCircle } from "lucide-react";

export default function Support() {
  const { currentUser, userProfile } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      
      {/* File Ticket Panel */}
      <div className="glass-card p-6 bg-white space-y-6 lg:col-span-1">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Raise a Ticket</h3>
          <p className="text-slate-400 text-xs mt-1">Submit issues regarding hours logging, certification, or profiles.</p>
        </div>

        <form onSubmit={handleCreateTicket} className="space-y-4">
          
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Issue Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-2xl border border-slate-200 py-2.5 px-4 text-slate-805 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs bg-white"
            >
              <option value="General">General Query</option>
              <option value="Attendance">Attendance & Hours</option>
              <option value="Certificates">Certificates Generation</option>
              <option value="Platform Bug">Platform Issue/Bug</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Urgency
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="block w-full rounded-2xl border border-slate-200 py-2.5 px-4 text-slate-805 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs bg-white"
            >
              <option value="Low">Low - Casual query</option>
              <option value="Medium">Medium - Normal assistance</option>
              <option value="High">High - Urgent issue</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. XP points not credited"
              className="block w-full rounded-2xl border border-slate-200 py-2.5 px-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          {/* Detailed Message */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Detailed Description
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide details about the issue..."
              rows={4}
              className="block w-full rounded-2xl border border-slate-200 py-2.5 px-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full justify-center items-center gap-2 rounded-2xl bg-primary py-2.5 px-4 text-xs font-bold text-white hover:bg-primary-hover focus:outline-hidden transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" />
            {submitting ? "Filing Query..." : "File Ticket"}
          </button>

        </form>
      </div>

      {/* Open/Previous Tickets */}
      <div className="glass-card p-6 bg-white space-y-6 lg:col-span-2">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">My Help Tickets</h3>
          <p className="text-slate-400 text-xs mt-1">Track status and replies on your filed support tickets.</p>
        </div>

        {loading ? (
          <div className="space-y-3 py-6">
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <LifeBuoy className="h-12 w-12 text-slate-300 mb-2" />
            <span className="text-sm font-medium text-slate-400">No support tickets found.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="p-4 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-bold text-slate-800 text-xs">{tkt.subject}</h4>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    tkt.status === "Resolved" || tkt.status === "Closed"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                    {tkt.status === "Resolved" ? <CheckCircle className="h-3 w-3 shrink-0" /> : <ShieldAlert className="h-3 w-3 shrink-0" />}
                    {tkt.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-normal">{tkt.message}</p>

                {tkt.adminReply && (
                  <div className="p-3 bg-white rounded-2xl border border-slate-100 text-[10px] leading-relaxed">
                    <span className="font-bold text-primary block">Official Support Team Response:</span>
                    <p className="text-slate-600 mt-1">{tkt.adminReply}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-[9px] text-slate-400 font-semibold border-t border-slate-100/50 pt-2.5">
                  <span>Category: {tkt.category}</span>
                  <span>•</span>
                  <span>Priority: {tkt.priority}</span>
                  <span>•</span>
                  <span>Logged: {tkt.createdAt?.seconds ? new Date(tkt.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
