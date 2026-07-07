import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, addDoc, getDocs, where, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Search, MapPin, Calendar as CalendarIcon, Users, CheckCircle, ShieldAlert } from "lucide-react";

export default function Programs() {
  const { currentUser, userProfile } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // 1. Fetch active programs
    const unsubProgs = onSnapshot(collection(db, "programs"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrograms(data.filter(p => p.status === "Active"));
      setLoading(false);
    });

    // 2. Fetch volunteer's applications
    const appQuery = query(collection(db, "applications"), where("userId", "==", currentUser?.uid || ""));
    const unsubscribeApps = onSnapshot(appQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserApplications(data);
    });

    return () => {
      unsubProgs();
      unsubscribeApps();
    };
  }, [currentUser]);

  const handleApply = async (program) => {
    if (!currentUser) return toast.error("Please log in first");

    // Check if already applied
    const alreadyApplied = userApplications.some((app) => app.programId === program.id);
    if (alreadyApplied) {
      return toast.error("You have already applied to this program");
    }

    try {
      // Add application document
      await addDoc(collection(db, "applications"), {
        userId: currentUser.uid,
        userName: userProfile?.displayName || currentUser.displayName || "Volunteer",
        userEmail: currentUser.email,
        programId: program.id,
        programTitle: program.title,
        status: "Pending", // Pending review by Admin
        appliedAt: serverTimestamp()
      });

      // Add a notification entry for the user
      await addDoc(collection(db, "notifications"), {
        userId: currentUser.uid,
        title: "Application Submitted",
        message: `Your application to participate in '${program.title}' has been submitted for review.`,
        read: false,
        createdAt: serverTimestamp()
      });

      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Apply error:", error);
      toast.error("Failed to submit application");
    }
  };

  const categories = ["All", "Education", "Environment", "Social Relief", "Health"];

  // Filter programs based on search and category
  const filteredPrograms = programs.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search programs by keyword, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-sm bg-white"
          />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-slate-600 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Programs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card p-8 bg-white">
          <ShieldAlert className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-700 text-lg">No Programs Found</h3>
          <p className="text-slate-400 text-sm mt-1">Try tweaking your search keywords or filter settings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => {
            const app = userApplications.find((a) => a.programId === prog.id);
            const isApplied = !!app;
            const appStatus = app?.status;

            return (
              <div key={prog.id} className="glass-card flex flex-col justify-between overflow-hidden bg-white hover:scale-[1.01] transition-transform duration-200">
                {/* Program image/banner */}
                <div className="h-44 w-full relative bg-slate-200">
                  {prog.bannerURL ? (
                    <img
                      src={prog.bannerURL}
                      alt={prog.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-orange-100 text-primary font-black text-2xl">
                      DISHA
                    </div>
                  )}
                  <span className="absolute top-4 left-4 text-[10px] font-bold text-white bg-primary/90 backdrop-blur-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {prog.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="truncate">{prog.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>Deadline: {prog.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Users className="h-4 w-4 shrink-0 text-slate-400" />
                      <span>Volunteers: {prog.registeredCount || 0} / {prog.volunteerLimit} Limit</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Hours / XP</span>
                      <span className="text-xs font-bold text-slate-700">{prog.hours} Hrs • {prog.xp} XP</span>
                    </div>

                    {isApplied ? (
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold capitalize ${
                        appStatus === "Approved"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : appStatus === "Rejected"
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        {appStatus}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(prog)}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm hover:shadow-md cursor-pointer transition-all"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
