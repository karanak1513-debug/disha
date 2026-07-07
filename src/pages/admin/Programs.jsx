import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Calendar, MapPin, Edit2, X, Check } from "lucide-react";
import { motion } from "framer-motion";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Manage Volunteer Opportunities</h3>
          <p className="text-slate-400 text-xs mt-1">Configure drives, update guidelines, or archive old postings.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-1.5 rounded-2xl bg-primary py-2.5 px-5 text-xs font-bold text-white hover:bg-primary-hover shadow-md hover:shadow-lg cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Program
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-72 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm glass-card bg-white p-8">
          No programs logged. Click "Create Program" to upload.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <div key={prog.id} className="glass-card overflow-hidden bg-white flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
              <div className="h-40 bg-slate-200 relative">
                <img
                  src={prog.bannerURL}
                  alt={prog.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-4 left-4 text-[9px] font-bold text-white bg-primary px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {prog.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1">{prog.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-normal">{prog.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100/60 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {prog.location}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> Deadline: {prog.deadline}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100/60">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(prog)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(prog.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Enrolled</span>
                    <span className="text-xs font-bold text-slate-700">{prog.registeredCount || 0} / {prog.volunteerLimit} Volunteers</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-2xl rounded-[24px] bg-white p-6 shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] space-y-6 z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-805 text-lg tracking-tight">
                  {editingProgram ? "Edit Program Details" : "Create New Program"}
                </h3>
                <p className="text-slate-500 text-xs mt-0.5 font-medium">Define volunteer slots, reward points, and drive requirements.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Program Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Swachh Bharat cleanliness drive"
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white cursor-pointer"
                  >
                    <option value="Education">Education</option>
                    <option value="Environment">Environment</option>
                    <option value="Social Relief">Social Relief</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New Delhi, Delhi"
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                {/* Volunteer Limit */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Volunteer Limit</label>
                  <input
                    type="number"
                    value={volunteerLimit}
                    onChange={(e) => setVolunteerLimit(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                {/* Hours Credited */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hours Credited</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                {/* XP Reward */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">XP reward points</label>
                  <input
                    type="number"
                    value={xp}
                    onChange={(e) => setXp(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                {/* Deadline */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Apply Deadline *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-805 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                {/* Skills */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skillsRequired}
                    onChange={(e) => setSkillsRequired(e.target.value)}
                    placeholder="e.g. Teaching, Organization, Physical Fitness"
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                {/* Banner URL */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Banner Image Link</label>
                  <input
                    type="text"
                    value={bannerURL}
                    onChange={(e) => setBannerURL(e.target.value)}
                    placeholder="https://..."
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-805 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campaign Details *</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe program goals, requirements, agenda..."
                    className="block w-full rounded-2xl border border-slate-200 py-3 px-4 text-xs font-semibold text-slate-805 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-4 focus:ring-primary/10 transition-all bg-white"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer transition-all active:scale-[0.98]"
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
