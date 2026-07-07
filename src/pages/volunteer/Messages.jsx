import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, addDoc, serverTimestamp, limit, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Send, Hash, Users, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Messages() {
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [channels] = useState([
    { id: "general", name: "General Discussion", icon: Hash },
    { id: "digital", name: "Digital Literacy Team", icon: Users },
    { id: "clean", name: "Clean Up Volunteers", icon: Calendar }
  ]);
  const [activeChannel, setActiveChannel] = useState("general");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Sync messages in realtime
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
      // Filter by active channel locally
      const filtered = data.filter((msg) => msg.channelId === activeChannel);
      setMessages(filtered);
    }, (error) => {
      console.error("Messages sync error:", error);
    });

    return () => unsubscribe();
  }, [activeChannel]);

  // Scroll to bottom on new message
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
        userName: userProfile?.displayName || currentUser.displayName || "Volunteer",
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="glass-card bg-white overflow-hidden h-[75vh] flex border border-slate-100">
      
      {/* Sidebar - Channel Selection */}
      <div className="w-64 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm">Chat Channels</h4>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {channels.map((chan) => {
            const Icon = chan.icon;
            const isActive = chan.id === activeChannel;
            return (
              <button
                key={chan.id}
                onClick={() => setActiveChannel(chan.id)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {chan.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Chat Workspace */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Workspace Header */}
        <div className="h-14 border-b border-slate-100 flex items-center px-6">
          <h4 className="font-bold text-slate-850 text-sm capitalize">
            # {channels.find(c => c.id === activeChannel)?.name}
          </h4>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">
              Start of discussion. Send a message to begin!
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.userId === currentUser.uid;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[70%] ${
                    isOwnMessage ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-bold text-slate-500">{msg.userName}</span>
                    <span className="text-[9px] text-slate-400">
                      {msg.createdAt?.seconds
                        ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : "Sending..."}
                    </span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isOwnMessage
                        ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10"
                        : "bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input panel */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 rounded-2xl border border-slate-200 py-3 px-4 text-slate-850 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
          />
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg cursor-pointer transition-all shrink-0"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>

      </div>

    </div>
  );
}
