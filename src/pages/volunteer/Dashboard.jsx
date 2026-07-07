import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedCounter from "../../components/AnimatedCounter";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  orderBy
} from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Trophy,
  Clock,
  Calendar,
  Award,
  Bell,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function VolunteerDashboard() {
  const { userProfile, currentUser } = useAuth();
  const [activePrograms, setActivePrograms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Realtime listeners for dashboard elements
  useEffect(() => {
    if (!currentUser) return;

    // 1. Fetch active programs applied by user
    const appsQuery = query(
      collection(db, "applications"),
      where("userId", "==", currentUser.uid),
      where("status", "==", "Approved"),
      limit(5)
    );
    const unsubscribeApps = onSnapshot(appsQuery, async (snapshot) => {
      const apps = snapshot.docs.map(doc => doc.data());
      // Get the program details for each approved application
      if (apps.length === 0) {
        setActivePrograms([]);
        return;
      }
      
      const progsQuery = query(collection(db, "programs"), limit(10));
      const unsubscribeProgs = onSnapshot(progsQuery, (progSnap) => {
        const allProgs = progSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const userProgs = allProgs.filter(p => apps.some(a => a.programId === p.id));
        setActivePrograms(userProgs);
      });
      return () => unsubscribeProgs();
    });

    // 2. Fetch announcements
    const annQuery = query(
      collection(db, "announcements"),
      orderBy("pinned", "desc"),
      limit(3)
    );
    const unsubscribeAnn = onSnapshot(annQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(data);
    }, (error) => {
      console.error("Announcements error:", error);
    });

    // 3. Fetch leaderboard
    const leadQuery = query(
      collection(db, "leaderboard"),
      orderBy("xp", "desc"),
      limit(5)
    );
    const unsubscribeLead = onSnapshot(leadQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaderboard(data);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard error:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeApps();
      unsubscribeAnn();
      unsubscribeLead();
    };
  }, [currentUser]);

  return (
    <div className="space-y-6">
      
      {/* Welcome / Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-orange-600 p-8 text-white shadow-xl shadow-primary/10">
        <div className="absolute right-0 bottom-0 top-0 hidden w-1/3 opacity-10 lg:block">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
            <polygon points="50,0 100,0 100,100 0,100" />
          </svg>
        </div>
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="h-3 w-3" />
            Volunteer Portal
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
            Hello, {userProfile?.displayName || "Volunteer"} 👋
          </h2>
          <p className="text-orange-50/90 text-sm leading-relaxed">
            Your contribution matters. Every hour you spend volunteering brings positive change to communities across India. Let's make an impact today!
          </p>
          <div className="pt-2">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-bold text-primary hover:bg-orange-50 transition-colors shadow-md"
            >
              Explore Opportunities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        
        {/* Stat Card: XP */}
        <div className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total XP</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">
              <AnimatedCounter value={userProfile?.xp || 0} />
            </h3>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
              +10% this month
            </span>
          </div>
        </div>

        {/* Stat Card: Hours */}
        <div className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hours Served</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">
              <AnimatedCounter value={userProfile?.hours || 0} suffix=" Hrs" />
            </h3>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
              Active contributor
            </span>
          </div>
        </div>

        {/* Stat Card: Programs */}
        <div className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Programs</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">
              <AnimatedCounter value={activePrograms.length} suffix=" Active" />
            </h3>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md mt-1 inline-block">
              Currently enrolled
            </span>
          </div>
        </div>

        {/* Stat Card: Certificates */}
        <div className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-slate-800">
              <AnimatedCounter value={userProfile?.certificatesCount || 0} />
            </h3>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md mt-1 inline-block">
              Verified credentials
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Left for content, Right for leaderboard */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column (Span 2): Active Programs & Announcements */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Active Enrolled Programs */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">My Active Programs</h3>
              <Link to="/programs" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 py-4">
                <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            ) : activePrograms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                <span className="text-sm font-medium text-slate-400 mb-2">No active programs yet.</span>
                <Link to="/programs" className="text-xs font-bold text-primary hover:underline">
                  Find a campaign to join →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activePrograms.map((prog) => (
                  <div key={prog.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{prog.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{prog.category} • {prog.location}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Enrolled
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Announcements */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-lg">Announcements & News</h3>
              <Link to="/announcements" className="text-sm font-semibold text-primary hover:underline">
                View updates
              </Link>
            </div>

            {announcements.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-sm">
                No recent announcements.
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="space-y-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 relative">
                    {ann.pinned && (
                      <span className="absolute top-4 right-4 text-[9px] font-bold text-primary bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-sm">
                        PINNED
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-slate-800 pr-12">{ann.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ann.content}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-400 font-medium">By {ann.author}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400">
                        {ann.createdAt?.seconds ? new Date(ann.createdAt.seconds * 1000).toLocaleDateString() : "Recently"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Leaderboard Widget */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Top Volunteers</h3>
            <Link to="/leaderboard" className="text-sm font-semibold text-primary hover:underline">
              Leaderboard
            </Link>
          </div>

          {leaderboard.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              Leaderboard is loading...
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((user, idx) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    idx === 0
                      ? "bg-amber-50/50 border-amber-100"
                      : idx === 1
                      ? "bg-slate-50 border-slate-200"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      idx === 0 ? "bg-amber-500 text-white" : idx === 1 ? "bg-slate-400 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{user.displayName}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{user.hours || 0} Hours</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {user.xp} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
