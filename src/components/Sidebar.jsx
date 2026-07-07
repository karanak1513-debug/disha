import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  CheckSquare,
  Trophy,
  MessageSquare,
  Bell,
  BellRing,
  FileBadge,
  BookOpen,
  Download,
  User,
  LifeBuoy,
  Settings,
  LogOut,
  Users,
  FileSpreadsheet,
  BarChart3,
  ChevronDown
} from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { logout, isAdmin, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    };
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

  const isAdminRoute = location.pathname.startsWith("/admin");

  const menuGroups = [
    {
      title: "Volunteer",
      show: !isAdminRoute,
      links: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Programs", path: "/programs", icon: Calendar },
        { name: "Applications", path: "/applications", icon: ClipboardList },
        { name: "Attendance", path: "/attendance", icon: CheckSquare },
        { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
      ],
    },
    {
      title: "Communication",
      show: !isAdminRoute,
      links: [
        { name: "Announcements", path: "/announcements", icon: Bell },
        { name: "Notifications", path: "/notifications", icon: BellRing },
      ],
    },
    {
      title: "Documents",
      show: !isAdminRoute,
      links: [
        { name: "Certificates", path: "/certificates", icon: FileBadge },
        { name: "Resources", path: "/resources", icon: BookOpen },
      ],
    },

    {
      title: "Administration",
      show: isAdmin && isAdminRoute,
      links: [
        { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Leaderboard", path: "/admin/leaderboard", icon: Trophy },
        { name: "Programs Mgmt", path: "/admin/programs", icon: Calendar },
        { name: "Applications Mgmt", path: "/admin/applications", icon: ClipboardList },
        { name: "Attendance Mgmt", path: "/admin/attendance", icon: CheckSquare },
        { name: "Reports", path: "/admin/reports", icon: FileSpreadsheet },
        { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
        { name: "Certificates", path: "/admin/certificates", icon: FileBadge },
        { name: "Resources", path: "/admin/resources", icon: BookOpen },
        { name: "Announcements", path: "/admin/announcements", icon: Bell },
        { name: "Support Center", path: "/admin/support", icon: LifeBuoy },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-100 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand/Logo Section */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200 bg-white">
          <Link to="/dashboard" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-primary text-white font-bold text-lg">
              D
            </span>
            <div>
              <span className="font-semibold text-slate-900 text-lg tracking-tight">DISHA</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-3 py-4 space-y-6">
          {menuGroups.filter(g => g.show).map((group) => (
            <div key={group.title}>
              <h4 className="px-3 mb-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {group.title}
              </h4>
              <nav className="space-y-1">
                {group.links.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                        isActive
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                      onClick={() => {
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-primary"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className={`h-4.5 w-4.5 transition-transform duration-200 ${isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"}`} />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Section (User Profile Card) */}
        <div className="shrink-0 p-4 border-t border-slate-200 bg-white">
          {userProfile && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">
                    {userProfile.displayName?.charAt(0).toUpperCase() || "V"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{userProfile.displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{userProfile.role || "Volunteer"}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0 ml-2 relative" ref={accountMenuRef}>
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className={`p-1.5 rounded-lg transition-colors ${showAccountMenu ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                
                <AnimatePresence>
                  {showAccountMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden flex flex-col z-50 py-1"
                    >
                      <Link to="/profile" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <User className="h-4 w-4" /> My Profile
                      </Link>
                      <Link to="/support" onClick={() => setShowAccountMenu(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <LifeBuoy className="h-4 w-4" /> Support Tickets
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <Link to={isAdmin && isAdminRoute ? "/admin/settings" : "/settings"} onClick={() => setShowAccountMenu(false)} className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
