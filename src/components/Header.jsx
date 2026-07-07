import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, Bell, Trophy, Clock, BadgeCheck, X, Check } from "lucide-react";
import { collection, query, where, onSnapshot, updateDoc, doc, limit } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Header({ toggleSidebar }) {
  const { userProfile, currentUser } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // Derive page name from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/dashboard")) return "Admin Dashboard Overview";
    if (path.startsWith("/admin/programs")) return "Programs Management";
    if (path.startsWith("/admin/applications")) return "Volunteer Applications";
    if (path.startsWith("/admin/attendance")) return "Attendance logs";
    if (path.startsWith("/admin/users")) return "User Management";
    if (path.startsWith("/admin/leaderboard")) return "Leaderboard Configuration";
    if (path.startsWith("/admin/support")) return "Support Desk";
    if (path.startsWith("/admin/certificates")) return "Certificates Hub";
    if (path.startsWith("/admin/announcements")) return "Announcements Creator";
    if (path.startsWith("/admin/messages")) return "Broadcasting Room";
    if (path.startsWith("/admin/analytics")) return "Analytics Center";
    if (path.startsWith("/admin/reports")) return "System Reports";
    
    if (path.startsWith("/dashboard")) return "Volunteer Dashboard";
    if (path.startsWith("/programs")) return "Explore Programs";
    if (path.startsWith("/applications")) return "My Applications";
    if (path.startsWith("/attendance")) return "Attendance Sheet";
    if (path.startsWith("/leaderboard")) return "State Leaderboard";
    if (path.startsWith("/messages")) return "Collaborative Room";
    if (path.startsWith("/announcements")) return "Updates & News";
    if (path.startsWith("/certificates")) return "My Certificates";
    if (path.startsWith("/support")) return "Support Center";
    if (path.startsWith("/profile")) return "Profile Settings";
    
    return "DISHA Platform";
  };

  // Listen to realtime notifications
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort notifications by date locally
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setNotifications(data);
    }, (error) => {
      console.error("Notifications error", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Click outside listener for notifications dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const notification of unread) {
      const docRef = doc(db, "notifications", notification.id);
      await updateDoc(docRef, { read: true });
    }
  };

  const handleNotificationClick = async (id) => {
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, { read: true });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md">
      {/* Left side: Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 lg:hidden cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight lg:text-2xl">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side: Stats, Search, Notifications, Avatar */}
      <div className="flex items-center gap-4 lg:gap-6">
        
        {/* Volunteer Stats (Hidden for admin) */}
        {!location.pathname.startsWith("/admin") && userProfile && (
          <div className="hidden items-center gap-4 rounded-full bg-slate-50 px-4 py-1.5 border border-slate-100 md:flex">
            <div className="flex items-center gap-1.5" title="XP Points">
              <Trophy className="h-4 w-4 text-[#F26522]" />
              <span className="text-xs font-bold text-slate-700">{userProfile.xp || 0} XP</span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5" title="Hours served">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-700">{userProfile.hours || 0} Hrs</span>
            </div>
          </div>
        )}

        {/* Notifications Icon with Badge */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) markAllAsRead();
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-slate-50 px-4 py-2">
                <span className="font-bold text-slate-800 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <span className="text-sm font-medium text-slate-400">All caught up!</span>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n.id)}
                      className={`flex flex-col gap-0.5 rounded-xl px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-800 truncate">{n.title}</span>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">{n.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1">
                        {n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar link */}
        <Link to="/profile" className="flex items-center gap-2 group">
          {userProfile?.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt="avatar"
              className="h-9 w-9 rounded-full border border-slate-200 object-cover group-hover:ring-2 group-hover:ring-primary/20 transition-all"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shadow-md shadow-primary/10">
              {userProfile?.displayName?.charAt(0).toUpperCase() || "D"}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
