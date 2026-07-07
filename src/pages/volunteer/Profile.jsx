import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { User, Phone, MapPin, Code, MessageSquare, Save } from "lucide-react";

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Overview Card */}
      <div className="glass-card p-6 bg-white flex flex-col items-center text-center space-y-4 lg:col-span-1">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-3xl shadow-inner border border-primary/20">
          {userProfile?.displayName?.charAt(0).toUpperCase() || "V"}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{userProfile?.displayName || "Volunteer"}</h3>
          <span className="text-xs text-slate-400 capitalize">{userProfile?.role} Account</span>
        </div>

        <div className="w-full border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">XP Earned</span>
            <span className="text-lg font-black text-primary mt-1 block">{userProfile?.xp || 0}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hours Served</span>
            <span className="text-lg font-black text-emerald-600 mt-1 block">{userProfile?.hours || 0} Hrs</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass-card p-6 bg-white space-y-6 lg:col-span-2">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Profile Details</h3>
          <p className="text-slate-400 text-xs mt-1">Keep your credentials up to date to access tailored campaigns.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
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
                  className="block w-full rounded-2xl border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
                  placeholder="Full Name"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
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
                  className="block w-full rounded-2xl border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
                  placeholder="+91 99999-99999"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
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
                  className="block w-full rounded-2xl border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
                  placeholder="New Delhi, Delhi"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Skills (Comma separated)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Code className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={profileData.skills}
                  onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                  className="block w-full rounded-2xl border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
                  placeholder="Teaching, Organization, First Aid"
                />
              </div>
            </div>

          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
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
                className="block w-full rounded-2xl border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
                placeholder="Share a little bit about yourself and why you'd like to volunteer..."
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-primary py-2.5 px-6 text-xs font-bold text-white hover:bg-primary-hover focus:outline-hidden transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
