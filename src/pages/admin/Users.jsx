import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Search, Shield, ShieldCheck, UserMinus, ToggleLeft, ToggleRight, Users as UsersIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function AdminUsers() {
  const { currentUser, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    if (userId === currentUser.uid) {
      return toast.error("You cannot change your own role!");
    }
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser.uid) return;
    if (!isSuperAdmin && user.role !== "Volunteer") {
      return toast.error("Only Super Admin can suspend other Administrators!");
    }
    try {
      const nextStatus = !user.suspended;
      await updateDoc(doc(db, "users", user.id), { suspended: nextStatus });
      toast.success(nextStatus ? "User suspended successfully" : "User activated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to change user status");
    }
  };

  const triggerDeleteConfirm = (userId) => {
    if (userId === currentUser.uid) {
      return toast.error("You cannot delete yourself!");
    }
    const targetUser = users.find(u => u.id === userId);
    if (!isSuperAdmin && targetUser?.role !== "Volunteer") {
      return toast.error("Only Super Admin can delete other Administrators!");
    }
    setUserToDeleteId(userId);
    setConfirmDeleteOpen(true);
  };

  const executeDeleteUser = async () => {
    if (!userToDeleteId) return;
    try {
      await deleteDoc(doc(db, "users", userToDeleteId));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    } finally {
      setUserToDeleteId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        {/* Subtle animated background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 left-1/2 w-64 h-64 bg-cyan-100/40 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Users</span>
            </motion.div>
            

          </div>
          
          {/* Header Stats */}
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}} className="flex-shrink-0 flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col items-end border-r border-slate-200 pr-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Users</span>
              <span className="text-2xl font-black text-emerald-600">{users.length}</span>
            </div>
            <div className="flex flex-col items-start pl-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Admins</span>
              <span className="text-2xl font-black text-slate-800">{users.filter(u => u.role === "Admin" || u.role === "Super Admin").length}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── DIRECTORY BENTO BOX ── */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Box Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-blue-100 flex items-center justify-center">
              <UsersIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">User Directory</h3>
              <p className="text-[11px] text-slate-500 font-medium">All registered members</p>
            </div>
          </div>
          
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium shadow-sm transition-all bg-white"
              />
            </div>

            <div className="flex gap-1.5 p-1 bg-slate-100/70 border border-slate-200/60 rounded-xl overflow-x-auto no-scrollbar">
              {["All", "Volunteer", "Admin", "Super Admin"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    roleFilter === role
                      ? "bg-white text-blue-700 shadow-sm border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory List */}
        <div className="bg-white">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-2">
                <Search className="h-5 w-5 text-slate-300" />
              </div>
              No users match your search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                    <th className="py-4 px-6">User Details</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6 text-center">XP Points</th>
                    <th className="py-4 px-6 text-center">Hours</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-semibold">
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id} 
                      initial={{opacity:0}} 
                      animate={{opacity:1}} 
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center text-xs font-black border shadow-sm ${
                            user.role?.includes('Admin') ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}>
                            {user.displayName?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[13px]">{user.displayName}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={user.role || "Volunteer"}
                          onChange={(e) => handleChangeRole(user.id, e.target.value)}
                          disabled={!isSuperAdmin || user.id === currentUser.uid}
                          className="rounded-lg border border-slate-200 py-1.5 px-3 text-[11px] text-slate-700 font-bold bg-white cursor-pointer hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:bg-slate-50 disabled:hover:border-slate-200 disabled:cursor-not-allowed shadow-sm"
                        >
                          <option value="Volunteer">Volunteer</option>
                          <option value="Admin">Admin</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-emerald-50 text-blue-700 font-black text-[11px] border border-blue-100/50">
                          {user.xp || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-slate-600 font-bold">{user.hours || 0} <span className="text-[10px] text-slate-400 font-medium">Hrs</span></span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(user)}
                            disabled={user.id === currentUser.uid || (!isSuperAdmin && user.role !== "Volunteer")}
                            className={`p-2 rounded-lg border cursor-pointer transition-all disabled:opacity-35 disabled:cursor-not-allowed shadow-sm active:scale-95 ${
                              user.suspended
                                ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                                : "bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                            }`}
                            title={user.suspended ? "Activate account" : "Suspend account"}
                          >
                            {user.suspended ? <ToggleRight className="h-4.5 w-4.5" /> : <ToggleLeft className="h-4.5 w-4.5" />}
                          </button>
                          <button
                            onClick={() => triggerDeleteConfirm(user.id)}
                            disabled={user.id === currentUser.uid || (!isSuperAdmin && user.role !== "Volunteer")}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed shadow-sm active:scale-95"
                            title="Delete user"
                          >
                            <UserMinus className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={executeDeleteUser}
        title="Delete User Record"
        message="Are you sure you want to permanently delete this user record from Firestore? This action cannot be undone."
      />
    </motion.div>
  );
}
