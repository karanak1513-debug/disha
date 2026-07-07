import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Trophy, Award, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  useEffect(() => {
    const q = query(collection(db, "leaderboard"), orderBy("xp", "desc"), limit(25));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaders(data);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard loading error", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredLeaders = leaders.filter((l) =>
    l.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topXP = leaders.length > 0 ? leaders[0].xp : 0;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E2E8F0] px-6 md:px-8 py-8 h-auto md:min-h-[100px] flex items-center relative overflow-hidden">
        <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          {/* Left Column */}
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <Link to="/dashboard" className="hover:text-slate-800 transition-colors">Volunteer</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Leaderboard</span>
            </motion.div>
            

          </div>

          {/* Right Column: Stats */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Users className="h-3 w-3" /> Ranked
                </span>
                <span className="text-lg font-black text-slate-800 leading-none mt-1">{leaders.length}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 mx-2" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> Highest XP
                </span>
                <span className="text-lg font-black text-amber-600 leading-none mt-1">{topXP}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BENTO BOX CONTAINER ── */}
      <motion.div variants={fadeUp} className="rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
        {/* Header toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shadow-sm">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">National Rankings</h3>
              <p className="text-[10px] text-slate-500 font-medium">Top 25 active volunteers</p>
            </div>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E2E8F0] text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] block pl-9 p-2.5 transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white">
          {loading ? (
            <div className="space-y-4">
              {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : filteredLeaders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <Search className="h-7 w-7 text-slate-300" />
              </div>
              <p className="font-bold text-slate-600 text-sm mb-1">No volunteers match your search.</p>
              <p className="text-slate-400 text-xs">Try a different name.</p>
            </motion.div>
          ) : (
            <div className="h-[500px] w-full pt-4 pb-12 px-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredLeaders} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E4E7" />
                  <XAxis 
                    dataKey="displayName" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#71717A', fontSize: 12, fontWeight: 700 }}
                    dy={20}
                    angle={-35}
                    textAnchor="end"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#71717A', fontSize: 12, fontWeight: 700 }}
                    dx={-10}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F4F4F5' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#18181B' }}
                    formatter={(value) => [`${value} XP`, 'Total XP']}
                  />
                  <Bar dataKey="xp" name="Total XP" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {filteredLeaders.map((entry, index) => {
                      // Gold, Silver, Bronze, then Indigo for the rest
                      const colors = ['#F59E0B', '#94A3B8', '#F97316'];
                      return <Cell key={`cell-${index}`} fill={index < 3 ? colors[index] : '#4F46E5'} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
