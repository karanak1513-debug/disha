import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Trophy, Award, Search, Sparkles } from "lucide-react";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="glass-card p-6 bg-white space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            National Leaderboard
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Celebrating the top volunteers driving community development across India.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search volunteers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-2xl border border-slate-200 py-2 pl-9 pr-4 text-slate-850 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 py-6">
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : filteredLeaders.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          No volunteers match your search.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeaders.map((user, idx) => {
            const isTopThree = idx < 3;
            const trophyColor = idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-400" : "text-amber-700";

            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.005] ${
                  idx === 0
                    ? "bg-amber-50/50 border-amber-100 shadow-sm"
                    : idx === 1
                    ? "bg-slate-50/50 border-slate-200"
                    : "bg-white border-slate-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-sm">
                    {isTopThree ? (
                      <Trophy className={`h-5 w-5 ${trophyColor}`} />
                    ) : (
                      <span className="text-slate-500">{idx + 1}</span>
                    )}
                  </div>

                  {/* Avatar / Initials */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm bg-gradient-to-br ${
                    idx === 0
                      ? "from-amber-400 to-orange-500 shadow-md"
                      : idx === 1
                      ? "from-slate-400 to-slate-500"
                      : "from-primary to-orange-600"
                  }`}>
                    {user.displayName?.charAt(0).toUpperCase() || "V"}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 text-sm">{user.displayName}</span>
                      {idx === 0 && (
                        <span className="inline-flex items-center gap-0.5 rounded-sm bg-amber-500/10 px-1 py-0.5 text-[8px] font-bold text-amber-600 uppercase tracking-wider">
                          <Sparkles className="h-2 w-2" /> Top Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500 font-semibold">{user.hours || 0} Hours Served</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{user.badges?.length || idx === 0 ? "3" : "1"} Badges</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-primary">{user.xp}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block -mt-0.5">XP</span>
                  </div>
                  <Award className="h-5 w-5 text-primary/30" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
