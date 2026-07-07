import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, addDoc, serverTimestamp, limit, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Send, Hash, Users, Shield } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminMessages() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [channels] = useState([
    { id: "general", name: "General Discussion", icon: Hash },
    { id: "digital", name: "Digital Literacy Team", icon: Users },
    { id: "clean", name: "Clean Up Volunteers", icon: Shield }
  ]);
  const [activeChannel, setActiveChannel] = useState("general");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const filtered = data.filter((msg) => msg.channelId === activeChannel);
      setMessages(filtered);
    }, (error) => {
      console.error(error);
    });

    return () => unsubscribe();
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const textToSend = inputText;
      setInputText("");

      await addDoc(collection(db, "messages"), {
        channelId: activeChannel,
        text: textToSend,
        userId: currentUser.uid,
        userName: `${currentUser.displayName || "Admin"} (Admin)`,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send broadcast");
    }
  };

  return (
    <div className="glass-card bg-white overflow-hidden h-[78vh] flex border border-slate-100 shadow-lg rounded-[24px]">
      
      {/* Sidebar - Channels */}
      <div className="w-72 border-r border-slate-100 flex flex-col bg-slate-50/40">
        <div className="p-5 border-b border-slate-100">
          <h4 className="font-extrabold text-slate-800 text-sm tracking-tight uppercase">Channels Deck</h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Select channel to broadcast</p>
        </div>
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {channels.map((chan) => {
            const Icon = chan.icon;
            const isActive = chan.id === activeChannel;
            return (
              <button
                key={chan.id}
                onClick={() => setActiveChannel(chan.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-orange-500 text-white shadow-md shadow-primary/10"
                    : "text-slate-650 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                {chan.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Chat Space */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-100 flex items-center px-6 justify-between bg-white shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">#</span>
            <h4 className="font-extrabold text-slate-805 text-sm tracking-tight capitalize">
              {channels.find(c => c.id === activeChannel)?.name}
            </h4>
          </div>
          <span className="text-[9px] font-extrabold text-primary bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">
            ADMINISTRATIVE MONITOR
          </span>
        </div>

        {/* Message Threads */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/30">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Send className="h-4.5 w-4.5" />
              </div>
              <h5 className="text-xs font-bold text-slate-700">No broadcasts logged</h5>
              <p className="text-[10px] text-slate-450 mt-0.5">Send a message to update volunteers in this channel.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.userId === currentUser.uid;
              const senderInitial = msg.userName?.charAt(0).toUpperCase() || "V";
              
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[80%] ${
                    isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  {/* Sender Avatar */}
                  <div className="flex-none self-end">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs border ${
                      isOwnMessage 
                        ? "bg-orange-50 border-orange-200 text-primary" 
                        : "bg-slate-100 border-slate-200 text-slate-650"
                    }`}>
                      {senderInitial}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[9px] font-extrabold text-slate-500">{msg.userName}</span>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {msg.createdAt?.seconds
                          ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : "Sending..."}
                      </span>
                    </div>
                    <div
                      className={`p-3.5 px-4 rounded-[20px] text-xs font-semibold leading-relaxed ${
                        isOwnMessage
                          ? "bg-gradient-to-r from-primary to-orange-500 text-white rounded-tr-none shadow-md shadow-primary/5"
                          : "bg-white text-slate-700 rounded-tl-none border border-slate-150/80 shadow-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Send announcement to #${channels.find(c => c.id === activeChannel)?.name}...`}
            className="flex-1 rounded-2xl border border-slate-200 py-3.5 px-5 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all text-xs font-semibold bg-white"
          />
          <button
            type="submit"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 text-white shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer transition-all active:scale-[0.96] shrink-0"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
