import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  CheckSquare,
  Trophy,
  MessageSquare,
  LifeBuoy,
  FileBadge,
  Bell,
  User,
  LogOut,
  Settings,
  Shield,
  BarChart3,
  FileSpreadsheet,
  Users
} from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { logout, isAdmin, userProfile, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };


  const volunteerLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Programs", path: "/programs", icon: Calendar },
    { name: "Applications", path: "/applications", icon: ClipboardList },
    { name: "Attendance", path: "/attendance", icon: CheckSquare },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Announcements", path: "/announcements", icon: Bell },
    { name: "Certificates", path: "/certificates", icon: FileBadge },
    { name: "Support Tickets", path: "/support", icon: LifeBuoy },
    { name: "Profile", path: "/profile", icon: User }
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Programs", path: "/admin/programs", icon: Calendar },
    { name: "Applications", path: "/admin/applications", icon: ClipboardList },
    { name: "Attendance logs", path: "/admin/attendance", icon: CheckSquare },
    { name: "User Directory", path: "/admin/users", icon: Users },
    { name: "Leaderboard Config", path: "/admin/leaderboard", icon: Trophy },
    { name: "Support Desk", path: "/admin/support", icon: LifeBuoy },
    { name: "Certificates Center", path: "/admin/certificates", icon: FileBadge },
    { name: "Announcements Pub", path: "/admin/announcements", icon: Bell },
    { name: "Broadcast Channels", path: "/admin/messages", icon: MessageSquare },
    { name: "Analytics Center", path: "/admin/analytics", icon: BarChart3 },
    { name: "System Reports", path: "/admin/reports", icon: FileSpreadsheet }
  ];

  const activeLinks = isAdminRoute ? adminLinks : volunteerLinks;

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
        <div className="flex h-16 items-center px-6 border-b border-slate-100 bg-white">
          <Link to={isAdminRoute ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg shadow-md shadow-primary/20">
              D
            </span>
            <div>
              <span className="font-extrabold text-slate-800 text-lg tracking-tight">DISHA</span>
              <span className="text-xs block text-primary font-semibold tracking-widest -mt-1">FOR INDIA</span>
            </div>
          </Link>
        </div>

        {/* User Card */}
        {userProfile && (
          <div className="p-4 mx-4 my-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              {userProfile.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {userProfile.displayName?.charAt(0).toUpperCase() || "V"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{userProfile.displayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-slate-500 font-medium capitalize">{userProfile.role}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-4 py-2 overflow-y-auto">
          {activeLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 space-y-1">
          {isAdmin && (
            <Link
              to={isAdminRoute ? "/dashboard" : "/admin/dashboard"}
              className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Shield className="h-5 w-5 text-slate-500" />
              {isAdminRoute ? "Volunteer Portal" : "Admin Panel"}
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5 text-rose-400" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
