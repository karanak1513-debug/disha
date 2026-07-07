import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, FileText, Calendar, Trophy, Trash2, Settings, ShieldAlert } from "lucide-react";

export default function Notifications() {
  const [filter, setFilter] = useState("All");
  
  // Mock data for notifications matching the screenshot
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Attendance Logged!",
      message: "You earned +100 XP and logged 10 hours for participating in 'digital market'.",
      time: "12:42 pm",
      date: "Today",
      type: "achievement",
      read: false,
      icon: Trophy
    },
    {
      id: 2,
      title: "Application Accepted!",
      message: "Congratulations! Your application to participate in 'digital market' has been approved.",
      time: "11:40 am",
      date: "Today",
      type: "success",
      read: true,
      icon: CheckCircle
    },
    {
      id: 3,
      title: "Application Submitted",
      message: "Your application to participate in 'digital market' has been submitted for review.",
      time: "11:39 am",
      date: "Today",
      type: "info",
      read: true,
      icon: FileText
    },
    {
      id: 4,
      title: "New Program Alert",
      message: "A new rural development program just opened in your preferred district.",
      time: "09:15 am",
      date: "Yesterday",
      type: "alert",
      read: true,
      icon: Bell
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "Unread") return !n.read;
    return true;
  });

  const getIconColor = (type) => {
    switch (type) {
      case "achievement": return "text-amber-500 bg-amber-50 border-amber-100";
      case "success": return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case "alert": return "text-emerald-500 bg-emerald-50 border-blue-100";
      case "warning": return "text-rose-500 bg-rose-50 border-rose-100";
      default: return "text-slate-500 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="space-y-0 pb-8 max-w-4xl mx-auto">
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse-slow" />

        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <Link to="/dashboard" className="hover:text-slate-800 cursor-pointer transition-colors">Volunteer</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Notifications</span>
            </motion.div>
          </div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex items-center gap-3">
            <button 
              onClick={markAllRead}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              Mark all as read
            </button>
            <button className="h-9 w-9 bg-white border border-slate-200 text-slate-500 rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer">
              <Settings className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 pb-2"
        >
          {["All", "Unread"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                filter === f
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {f}
              {f === "Unread" && notifications.filter(n => !n.read).length > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${filter === f ? "bg-white/20" : "bg-blue-100 text-emerald-600"}`}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Notifications List */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                  <Bell className="h-6 w-6 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">All caught up!</h3>
                <p className="text-sm text-slate-500">You have no new notifications.</p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification, i) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group relative p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors flex gap-4 ${!notification.read ? 'bg-emerald-50/30' : ''}`}
                  >
                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    )}

                    {/* Icon */}
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-sm ${getIconColor(notification.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h4 className={`text-[15px] ${!notification.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                          {notification.date} at {notification.time}
                        </span>
                      </div>
                      <p className={`text-[14px] leading-relaxed ${!notification.read ? 'text-slate-600' : 'text-slate-500'}`}>
                        {notification.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
