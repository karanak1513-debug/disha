import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, Trophy, Clock, BadgeCheck, X, Check, Shield, User, Settings as SettingsIcon, LifeBuoy, LogOut } from "lucide-react";
import { collection, query, where, onSnapshot, updateDoc, doc, limit } from "firebase/firestore";
import { db } from "../firebase/config";
import { AnimatePresence, motion } from "framer-motion";

export default function Header({ toggleSidebar }) {
  const { userProfile, currentUser, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Derive page name from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/dashboard")) return "";
    if (path.startsWith("/admin/programs")) return "";
    if (path.startsWith("/admin/applications")) return "";
    if (path.startsWith("/admin/attendance")) return "";
    if (path.startsWith("/admin/users")) return "";
    if (path.startsWith("/admin/leaderboard")) return "Leaderboard Configuration";
    if (path.startsWith("/admin/support")) return "";
    if (path.startsWith("/admin/certificates")) return "";
    if (path.startsWith("/admin/announcements")) return "";
    if (path.startsWith("/admin/messages")) return "Broadcasting Room";
    if (path.startsWith("/admin/analytics")) return "";
    if (path.startsWith("/admin/reports")) return "";
    
    if (path === "/dashboard" || path === "/") return "";
    if (path.startsWith("/programs")) return "";
    if (path.startsWith("/applications")) return "";
    if (path.startsWith("/attendance")) return "";
    if (path.startsWith("/leaderboard")) return "";
    if (path.startsWith("/messages")) return "Collaborative Room";
    if (path.startsWith("/announcements")) return "";
    if (path.startsWith("/certificates")) return "";
    if (path.startsWith("/support")) return "";
    if (path.startsWith("/profile")) return "";
    
    return "";
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

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E2E8F0] bg-white/80 px-6 backdrop-blur-md">
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
          <div className="hidden items-center gap-3.5 rounded-[12px] bg-white px-4 py-1.5 border border-[#E2E8F0] md:flex">
            <div className="flex items-center gap-1.5" title="XP Points">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-slate-700">{userProfile.xp || 0} XP</span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5" title="Hours served">
              <Clock className="h-4 w-4 text-secondary" />
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
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-primary to-blue-600 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-xl ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-2.5">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <span className="text-xs font-semibold text-slate-400">All caught up!</span>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n.id)}
                      className={`flex flex-col gap-0.5 rounded-xl px-3.5 py-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 truncate">{n.title}</span>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">{n.message}</p>
                      <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                        {n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-slate-100 mt-1 p-2 text-center bg-slate-50/50 rounded-b-2xl">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="block text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline w-full py-1 cursor-pointer transition-colors"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin portal switcher */}
        {isAdmin && (
          <Link
            to={isAdminRoute ? "/dashboard" : "/admin/dashboard"}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-200 ${
              isAdminRoute
                ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/80"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            {isAdminRoute ? "Admin Mode" : "Switch to Admin"}
          </Link>
        )}

        {/* Profile Avatar link */}
        <div className="relative" ref={profileDropdownRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="avatar"
                className="h-9 w-9 rounded-xl border border-slate-200 object-cover group-hover:ring-2 group-hover:ring-primary/20 transition-all duration-300"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-600 text-white font-black text-xs shadow-md shadow-primary/10 transition-all duration-300 group-hover:scale-105">
                {userProfile?.displayName?.charAt(0).toUpperCase() || "D"}
              </div>
            )}
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden flex flex-col z-50 py-1"
              >
                <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                  <User className="h-4 w-4" /> My Profile
                </Link>
                <Link to="/support" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                  <LifeBuoy className="h-4 w-4" /> Support Tickets
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
                <Link to={isAdmin && isAdminRoute ? "/admin/settings" : "/settings"} onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                  <SettingsIcon className="h-4 w-4" /> Settings
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors text-left w-full cursor-pointer">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
