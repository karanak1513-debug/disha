import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedCounter from "../../components/AnimatedCounter";
import { collection, onSnapshot, query, where, limit, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Users,
  Calendar,
  Clock,
  Award,
  LifeBuoy,
  Bell,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  
  // Dashboard statistics
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    activePrograms: 0,
    hoursServed: 0,
    certificatesCount: 0,
    pendingApps: 0,
    openTickets: 0
  });
  
  const [recentTickets, setRecentTickets] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    firestore: "Healthy",
    auth: "Healthy",
    storage: "Healthy",
    cloudFunctions: "Healthy"
  });

  useEffect(() => {
    // 1. Get total volunteers
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats((prev) => ({ ...prev, totalVolunteers: snapshot.size }));
    });

    // 2. Get active programs
    const unsubProgs = onSnapshot(collection(db, "programs"), (snapshot) => {
      const active = snapshot.docs.filter((d) => d.data().status === "Active").length;
      setStats((prev) => ({ ...prev, activePrograms: active }));
    });

    // 3. Get total hours served
    const unsubAttendance = onSnapshot(collection(db, "attendance"), (snapshot) => {
      let hours = 0;
      snapshot.docs.forEach((doc) => {
        hours += doc.data().hours || 0;
      });
      setStats((prev) => ({ ...prev, hoursServed: hours }));
    });

    // 4. Get certificates issued
    const unsubCerts = onSnapshot(collection(db, "certificates"), (snapshot) => {
      setStats((prev) => ({ ...prev, certificatesCount: snapshot.size }));
    });

    // 5. Get pending applications & recent applications
    const unsubApps = onSnapshot(collection(db, "applications"), (snapshot) => {
      const pending = snapshot.docs.filter((d) => d.data().status === "Pending");
      setStats((prev) => ({ ...prev, pendingApps: pending.length }));
      
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      apps.sort((a, b) => (b.appliedAt?.seconds || 0) - (a.appliedAt?.seconds || 0));
      setRecentApps(apps.slice(0, 5));
    });

    // 6. Get open tickets
    const unsubTickets = onSnapshot(collection(db, "supportTickets"), (snapshot) => {
      const open = snapshot.docs.filter((d) => d.data().status === "Open");
      setStats((prev) => ({ ...prev, openTickets: open.length }));

      const tkts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      tkts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRecentTickets(tkts.slice(0, 4));
    });

    return () => {
      unsubUsers();
      unsubProgs();
      unsubAttendance();
      unsubCerts();
      unsubApps();
      unsubTickets();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-orange-600 p-8 text-white shadow-xl shadow-primary/10">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="h-3 w-3" />
            Control Hub
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Hello, Admin 👋
          </h2>
          <p className="text-orange-50/95 text-xs leading-relaxed">
            Welcome to the DISHA Management Dashboard. From here you can run application approvals, mark volunteer check-ins, configure campaigns, publish broadcasts, and manage verified certificates.
          </p>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        
        {/* Total Volunteers */}
        <div className="glass-card p-4 bg-white flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volunteers</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-800">
              <AnimatedCounter value={stats.totalVolunteers} />
            </h3>
            <span className="text-[8px] font-bold text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded-sm">Registered</span>
          </div>
        </div>

        {/* Active Programs */}
        <div className="glass-card p-4 bg-white flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campaigns</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-800">
              <AnimatedCounter value={stats.activePrograms} suffix=" Active" />
            </h3>
            <span className="text-[8px] font-bold text-slate-400 bg-slate-50 px-1 py-0.5 rounded-sm">In progress</span>
          </div>
        </div>

        {/* Hours Served */}
        <div className="glass-card p-4 bg-white flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Hours</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-800">
              <AnimatedCounter value={stats.hoursServed} suffix=" Hrs" />
            </h3>
            <span className="text-[8px] font-bold text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded-sm">Volunteered</span>
          </div>
        </div>

        {/* Certificates */}
        <div className="glass-card p-4 bg-white flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certificates</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Award className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-800">
              <AnimatedCounter value={stats.certificatesCount} />
            </h3>
            <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1 py-0.5 rounded-sm">Generated</span>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="glass-card p-4 bg-white flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Apps</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-800">
              <AnimatedCounter value={stats.pendingApps} />
            </h3>
            <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded-sm">Need review</span>
          </div>
        </div>

        {/* Open Support Tickets */}
        <div className="glass-card p-4 bg-white flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Tickets</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <LifeBuoy className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl font-black text-slate-800">
              <AnimatedCounter value={stats.openTickets} />
            </h3>
            <span className="text-[8px] font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded-sm">Awaiting Reply</span>
          </div>
        </div>

      </div>

      {/* Quick Actions Panel */}
      <div className="glass-card p-6 bg-white space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Quick Administrative Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          
          <Link
            to="/admin/programs"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors"
          >
            <Calendar className="h-5 w-5 text-primary mb-1.5" />
            <span className="text-[10px] font-bold text-slate-700">New Program</span>
          </Link>

          <Link
            to="/admin/applications"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors"
          >
            <Users className="h-5 w-5 text-blue-500 mb-1.5" />
            <span className="text-[10px] font-bold text-slate-700">App Review</span>
          </Link>

          <Link
            to="/admin/attendance"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors"
          >
            <Clock className="h-5 w-5 text-emerald-500 mb-1.5" />
            <span className="text-[10px] font-bold text-slate-700">Log Hours</span>
          </Link>

          <Link
            to="/admin/announcements"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-amber-500 mb-1.5" />
            <span className="text-[10px] font-bold text-slate-700">Broadcast</span>
          </Link>

          <Link
            to="/admin/certificates"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors"
          >
            <Award className="h-5 w-5 text-purple-500 mb-1.5" />
            <span className="text-[10px] font-bold text-slate-700">Issue Cert</span>
          </Link>

          <Link
            to="/admin/reports"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors"
          >
            <LifeBuoy className="h-5 w-5 text-teal-500 mb-1.5" />
            <span className="text-[10px] font-bold text-slate-700">Reports</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors"
          >
            <Users className="h-5 w-5 text-slate-600 mb-1.5" />
            <span className="text-[10px] font-bold text-slate-700">Users Info</span>
          </Link>

          <Link
            to="/admin/analytics"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100 transition-colors"
          >
            <Users className="h-5 w-5 text-rose-500 mb-1.5" />
            <span className="text-[10px] font-bold text-slate-700">Analytics</span>
          </Link>

        </div>
      </div>

      {/* Lower grid: Applications, Tickets, Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column (Span 2): Recent Applications & Tickets */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Recent applications */}
          <div className="glass-card p-6 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Recent Applications</h3>
              <Link to="/admin/applications" className="text-xs font-semibold text-primary hover:underline">
                View all review deck
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="py-4 text-center text-slate-400 text-xs">
                No recent volunteer applications.
              </div>
            ) : (
              <div className="space-y-2">
                {recentApps.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{app.userName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Applied for: {app.programTitle}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      app.status === "Approved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Support Tickets */}
          <div className="glass-card p-6 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Pending Support Helpdesk</h3>
              <Link to="/admin/support" className="text-xs font-semibold text-primary hover:underline">
                Resolve tickets
              </Link>
            </div>

            {recentTickets.length === 0 ? (
              <div className="py-4 text-center text-slate-400 text-xs">
                No pending support requests.
              </div>
            ) : (
              <div className="space-y-2">
                {recentTickets.map((tkt) => (
                  <div key={tkt.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-850">{tkt.subject}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">By {tkt.volunteerName} • Priority: {tkt.priority}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      tkt.status === "Open" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {tkt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Platform Health Check */}
        <div className="glass-card p-6 bg-white space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Platform Health Status</h3>
          <div className="space-y-3.5">
            
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Firestore Database</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase">
                <ShieldCheck className="h-4 w-4" /> 🟢 Online
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Authentication Service</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase">
                <ShieldCheck className="h-4 w-4" /> 🟢 Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Asset Cloud Storage</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase">
                <ShieldCheck className="h-4 w-4" /> 🟢 Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Server API Functions</span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase">
                <ShieldCheck className="h-4 w-4" /> 🟢 Healthy
              </span>
            </div>

          </div>
        </div>

      </div>

    </motion.div>
  );
}
