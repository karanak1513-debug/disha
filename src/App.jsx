import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// Public Pages
import Landing from "./pages/Landing";
import Impact from "./pages/public/Impact";
import Blogs from "./pages/public/Blogs";
import Contact from "./pages/public/Contact";
import GenericPage from "./pages/public/GenericPage";
import FAQ from "./pages/public/FAQ";


// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Volunteer / User Pages
import VolunteerDashboard from "./pages/volunteer/Dashboard";
import VolunteerPrograms from "./pages/volunteer/Programs";
import VolunteerApplications from "./pages/volunteer/Applications";
import VolunteerAttendance from "./pages/volunteer/Attendance";
import VolunteerLeaderboard from "./pages/volunteer/Leaderboard";
import VolunteerMessages from "./pages/volunteer/Messages";
import VolunteerAnnouncements from "./pages/volunteer/Announcements";
import VolunteerCertificates from "./pages/volunteer/Certificates";
import VolunteerResources from "./pages/volunteer/Resources";
import VolunteerNotifications from "./pages/volunteer/Notifications";
import VolunteerSupport from "./pages/volunteer/Support";
import VolunteerProfile from "./pages/volunteer/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPrograms from "./pages/admin/Programs";
import AdminApplications from "./pages/admin/Applications";
import AdminAttendance from "./pages/admin/Attendance";
import AdminUsers from "./pages/admin/Users";
import AdminLeaderboard from "./pages/admin/Leaderboard";
import AdminSupport from "./pages/admin/Support";
import AdminCertificates from "./pages/admin/Certificates";
import AdminAnnouncements from "./pages/admin/Announcements";
import AdminMessages from "./pages/admin/Messages";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminReports from "./pages/admin/Reports";
import AdminResources from "./pages/admin/Resources";

// Shared Pages
import Settings from "./pages/Settings";

// Protected Route Wrapper for Volunteers
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

// Protected Route Wrapper for Admins
function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

function Bootstrapper() {
  const { userProfile, logout } = useAuth();

  if (userProfile?.suspended) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-slate-100 text-center space-y-6">
          <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mx-auto animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Account Suspended</h2>
            <p className="text-slate-500 text-xs font-semibold px-4 leading-relaxed">
              Your access to the DISHA Volunteer Portal has been restricted by the administrative staff.
            </p>
          </div>

          <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl text-[11px] text-rose-600 font-bold leading-relaxed text-left space-y-1">
            <p className="font-extrabold">Restriction Details:</p>
            <ul className="list-disc list-inside space-y-1 font-semibold text-rose-500">
              <li>Message broadcasting rooms locked</li>
              <li>Attendance hour logging disabled</li>
              <li>Certificate verification suspended</li>
            </ul>
          </div>

          <button
            onClick={() => logout()}
            className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 px-4 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Log Out Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/impact" element={<Impact />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/p/:pageId" element={<GenericPage />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Volunteer Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><VolunteerDashboard /></ProtectedRoute>} />
      <Route path="/programs" element={<ProtectedRoute><VolunteerPrograms /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><VolunteerApplications /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><VolunteerAttendance /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><VolunteerLeaderboard /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><VolunteerMessages /></ProtectedRoute>} />
      <Route path="/announcements" element={<ProtectedRoute><VolunteerAnnouncements /></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute><VolunteerCertificates /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><VolunteerResources /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><VolunteerNotifications /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><VolunteerSupport /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><VolunteerProfile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/programs" element={<AdminRoute><AdminPrograms /></AdminRoute>} />
      <Route path="/admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
      <Route path="/admin/attendance" element={<AdminRoute><AdminAttendance /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/leaderboard" element={<AdminRoute><AdminLeaderboard /></AdminRoute>} />
      <Route path="/admin/support" element={<AdminRoute><AdminSupport /></AdminRoute>} />
      <Route path="/admin/certificates" element={<AdminRoute><AdminCertificates /></AdminRoute>} />
      <Route path="/admin/announcements" element={<AdminRoute><AdminAnnouncements /></AdminRoute>} />
      <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
      <Route path="/admin/resources" element={<AdminRoute><AdminResources /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />

      {/* Default Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Bootstrapper />
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </BrowserRouter>
  );
}
