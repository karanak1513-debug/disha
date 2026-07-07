import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Calendar, MapPin, Edit2, X, Users, Clock, Target, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};
const slideIn = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Education");
  const [location, setLocation] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [volunteerLimit, setVolunteerLimit] = useState(20);
  const [hours, setHours] = useState(10);
  const [xp, setXp] = useState(100);
  const [deadline, setDeadline] = useState("");
  const [bannerURL, setBannerURL] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "programs"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPrograms(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    setEditingProgram(null);
    setTitle("");
    setDescription("");
    setCategory("Education");
    setLocation("");
    setSkillsRequired("");
    setVolunteerLimit(20);
    setHours(10);
    setXp(100);
    setDeadline("");
    setBannerURL("");
    setShowModal(true);
  };

  const openEditModal = (prog) => {
    setEditingProgram(prog);
    setTitle(prog.title || "");
    setDescription(prog.description || "");
    setCategory(prog.category || "Education");
    setLocation(prog.location || "");
    setSkillsRequired(Array.isArray(prog.skillsRequired) ? prog.skillsRequired.join(", ") : prog.skillsRequired || "");
    setVolunteerLimit(prog.volunteerLimit || 20);
    setHours(prog.hours || 10);
    setXp(prog.xp || 100);
    setDeadline(prog.deadline || "");
    setBannerURL(prog.bannerURL || "");
    setShowModal(true);
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    if (!title || !description || !location || !deadline) {
      return toast.error("Please fill in all required fields");
    }

    const skillsArray = skillsRequired
      ? skillsRequired.split(",").map((s) => s.trim())
      : [];

    const defaultBanner = bannerURL || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800";

    const payload = {
      title,
      description,
      category,
      location,
      skillsRequired: skillsArray,
      volunteerLimit: Number(volunteerLimit),
      hours: Number(hours),
      xp: Number(xp),
      deadline,
      bannerURL: defaultBanner,
      status: "Active",
      updatedAt: serverTimestamp()
    };

    try {
      if (editingProgram) {
        // Edit program
        const docRef = doc(db, "programs", editingProgram.id);
        await updateDoc(docRef, payload);
        toast.success("Program updated successfully!");
      } else {
        // Create program
        payload.registeredCount = 0;
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, "programs"), payload);
        toast.success("Program created successfully!");
      }
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save program");
    }
  };

  const handleDeleteProgram = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await deleteDoc(doc(db, "programs", id));
      toast.success("Program deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete program");
    }
  };

  const activeCount = programs.filter(p => p.status === "Active").length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 left-1/2 w-64 h-64 bg-fuchsia-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Programs</span>
            </motion.div>
            

          </div>
          
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}} className="flex-shrink-0 flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col items-end border-r border-slate-200 pr-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Drives</span>
              <span className="text-2xl font-black text-slate-800">{programs.length}</span>
            </div>
            <div className="flex flex-col items-start pr-4 border-r border-slate-200">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active</span>
              <span className="text-2xl font-black text-emerald-600">{activeCount}</span>
            </div>
            <button
              onClick={openCreateModal}
              className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="h-6 w-6" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[400px] bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center justify-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Rocket className="h-8 w-8 text-slate-300" />
          </div>
          No programs logged. Click the "+" button in the header to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <motion.div variants={fadeUp} key={prog.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all duration-300">
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <img
                  src={prog.bannerURL}
                  alt={prog.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] font-bold text-white bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm border border-white/10">
                  {prog.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1 mb-1.5 group-hover:text-emerald-600 transition-colors">{prog.title}</h4>
                  <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">{prog.description}</p>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center"><MapPin className="h-3.5 w-3.5 text-slate-400" /></div> 
                    {prog.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center"><Calendar className="h-3.5 w-3.5 text-slate-400" /></div>
                    Deadline: <span className="font-bold text-slate-700">{prog.deadline}</span>
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-orange-400"/> {prog.hours} Hrs</span>
                    <span className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-indigo-400"/> {prog.xp} XP</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(prog)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:text-emerald-600 text-slate-500 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(prog.id)}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mb-0.5">Enrolled</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-emerald-600">{prog.registeredCount || 0}</span>
                      <span className="text-[11px] font-bold text-slate-400">/ {prog.volunteerLimit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">
                  {editingProgram ? "Edit Program Details" : "Create New Program"}
                </h3>
                <p className="text-slate-500 text-xs mt-1 font-medium">Define volunteer slots, reward points, and drive requirements.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Program Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Swachh Bharat cleanliness drive"
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50 cursor-pointer"
                  >
                    <option value="Education">Education</option>
                    <option value="Environment">Environment</option>
                    <option value="Social Relief">Social Relief</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New Delhi, Delhi"
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Volunteer Limit</label>
                  <input
                    type="number"
                    value={volunteerLimit}
                    onChange={(e) => setVolunteerLimit(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hours Credited</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">XP Reward Points</label>
                  <input
                    type="number"
                    value={xp}
                    onChange={(e) => setXp(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Apply Deadline *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skillsRequired}
                    onChange={(e) => setSkillsRequired(e.target.value)}
                    placeholder="e.g. Teaching, Organization, Physical Fitness"
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Banner Image Link</label>
                  <input
                    type="text"
                    value={bannerURL}
                    onChange={(e) => setBannerURL(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Campaign Details *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe program goals, requirements, agenda..."
                    className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-all active:scale-95 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98]"
                >
                  Save Program
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
