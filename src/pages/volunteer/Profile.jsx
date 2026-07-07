import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { User, Phone, MapPin, Code, MessageSquare, Save, Settings, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, userProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: "",
    phoneNumber: "",
    location: "",
    skills: "",
    bio: ""
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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
    if (!currentUser) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            fullName: data.fullName || currentUser.displayName || "",
            phoneNumber: data.phoneNumber || "",
            location: data.location || "",
            skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || "",
            bio: data.bio || ""
          });
        } else {
          setProfileData({
            fullName: currentUser.displayName || "",
            phoneNumber: "",
            location: "",
            skills: "",
            bio: ""
          });
        }
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profileData.fullName) return toast.error("Full Name is required");

    try {
      setSaving(true);

      // Save to profiles collection
      const profileRef = doc(db, "profiles", currentUser.uid);
      const skillsArray = profileData.skills
        ? profileData.skills.split(",").map((s) => s.trim())
        : [];

      await setDoc(profileRef, {
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        location: profileData.location,
        skills: skillsArray,
        bio: profileData.bio,
        email: currentUser.email,
        updatedAt: new Date()
      }, { merge: true });

      // Sync display name with users collection (using setDoc with merge to prevent document not found errors)
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, {
        displayName: profileData.fullName
      }, { merge: true });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile save error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto md:min-h-[100px] flex items-center relative overflow-hidden">
        {/* Subtle animated background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 right-1/4 w-64 h-64 bg-cyan-100/30 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          {/* Left Column */}
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <Link to="/dashboard" className="hover:text-slate-800 transition-colors">Account</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">My Profile</span>
            </motion.div>
            

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Overview Card */}
        <motion.div variants={fadeUp} className="lg:col-span-1">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Account Overview</h3>
              </div>
            </div>
            
            <div className="p-6 flex flex-col items-center text-center space-y-5 bg-white">
              <div className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 font-black text-4xl shadow-sm border border-blue-100/50 relative">
                {userProfile?.displayName?.charAt(0).toUpperCase() || profileData.fullName.charAt(0).toUpperCase() || "V"}
                <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Online">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{userProfile?.displayName || profileData.fullName || "Volunteer"}</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase mt-2 border border-slate-200">
                  {userProfile?.role} Account
                </span>
              </div>

              <div className="w-full border-t border-slate-100 pt-5 grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">XP Earned</span>
                  <span className="text-xl font-black text-slate-800 block leading-none">{userProfile?.xp || 0}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-1">Hrs Served</span>
                  <span className="text-xl font-black text-slate-800 block leading-none">{userProfile?.hours || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Edit Form */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Settings className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Profile Details</h3>
                <p className="text-[10px] text-slate-500 font-medium">Update your personal information</p>
              </div>
            </div>

            {loading ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                  <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                  <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                  <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                </div>
                <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="p-6 space-y-6 bg-white flex-1">
                
                {/* Read Only Email */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 flex items-center gap-4 mb-2">
                  <div className="h-10 w-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Account Email</p>
                    <p className="text-sm font-semibold text-slate-700 truncate">{currentUser?.email}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 uppercase border border-emerald-100">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 transition-all outline-none font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 transition-all outline-none font-medium"
                        placeholder="+91 99999-99999"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                      State / Location
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 transition-all outline-none font-medium"
                        placeholder="New Delhi, Delhi"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                      Skills <span className="normal-case font-medium text-slate-400">(Comma separated)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Code className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={profileData.skills}
                        onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                        className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 transition-all outline-none font-medium"
                        placeholder="Teaching, First Aid, Tech..."
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                    Bio / Short Description
                  </label>
                  <div className="relative">
                    <span className="absolute top-3 left-3 text-slate-400">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      rows={4}
                      className="block w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm bg-slate-50 transition-all outline-none font-medium resize-none"
                      placeholder="Share a little bit about yourself and why you'd like to volunteer..."
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end border-t border-slate-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] py-2.5 px-8 text-sm font-bold text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm disabled:opacity-50 mt-4"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving Changes..." : "Save Profile"}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
