import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { BarChart3, TrendingUp, Award, Clock } from "lucide-react";

export default function AdminAnalytics() {
  const [volunteersCount, setVolunteersCount] = useState(0);
  const [hoursCount, setHoursCount] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [programsCount, setProgramsCount] = useState(0);

  // Sample static trends that overlay with database counts
  const engagementData = [
    { name: "Jan", volunteers: 10, hours: 25, certificates: 5 },
    { name: "Feb", volunteers: 20, hours: 55, certificates: 8 },
    { name: "Mar", volunteers: 35, hours: 90, certificates: 15 },
    { name: "Apr", volunteers: 48, hours: 140, certificates: 22 },
    { name: "May", volunteers: 62, hours: 210, certificates: 35 },
    { name: "Jun", volunteers: 85, hours: 290, certificates: 48 },
    { name: "Jul", volunteers: 110, hours: 380, certificates: 64 }
  ];

  const programData = [
    { name: "Education", limit: 50, enrolled: 44 },
    { name: "Environment", limit: 80, enrolled: 68 },
    { name: "Social Relief", limit: 30, enrolled: 29 },
    { name: "Health", limit: 40, enrolled: 12 }
  ];

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setVolunteersCount(snapshot.size);
    });

    const unsubCerts = onSnapshot(collection(db, "certificates"), (snapshot) => {
      setCertsCount(snapshot.size);
    });

    const unsubProgs = onSnapshot(collection(db, "programs"), (snapshot) => {
      setProgramsCount(snapshot.size);
    });

    const unsubAttendance = onSnapshot(collection(db, "attendance"), (snapshot) => {
      let hrs = 0;
      snapshot.docs.forEach(doc => { hrs += doc.data().hours || 0; });
      setHoursCount(hrs);
    });

    return () => {
      unsubUsers();
      unsubCerts();
      unsubProgs();
      unsubAttendance();
    };
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Volunteers */}
        <div className="glass-card p-6 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Volunteers</span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{volunteersCount}</h3>
          </div>
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Hours */}
        <div className="glass-card p-6 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Hours Volunteered</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{hoursCount} Hrs</h3>
          </div>
          <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Certificates */}
        <div className="glass-card p-6 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Certificates Issued</span>
            <h3 className="text-2xl font-black text-purple-600 mt-1">{certsCount}</h3>
          </div>
          <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
        </div>

        {/* Programs */}
        <div className="glass-card p-6 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Total Campaigns</span>
            <h3 className="text-2xl font-black text-blue-600 mt-1">{programsCount}</h3>
          </div>
          <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Volunteer & Hours Trend */}
        <div className="glass-card p-6 bg-white space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Volunteer Growth & Hours Trend</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Realtime progress of total participation since platform startup.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F26522" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F26522" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                <Area type="monotone" dataKey="volunteers" name="Volunteers Count" stroke="#F26522" fillOpacity={1} fill="url(#colorVol)" strokeWidth={2} />
                <Area type="monotone" dataKey="hours" name="Total Hours Logged" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Program category metrics */}
        <div className="glass-card p-6 bg-white space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Enrollments by Campaign Category</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Summary of volunteer registration rates vs available slots.</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={programData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: "bold" }} />
                <Bar dataKey="enrolled" name="Enrolled Volunteers" fill="#F26522" radius={[4, 4, 0, 0]} />
                <Bar dataKey="limit" name="Target Cap Limit" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
