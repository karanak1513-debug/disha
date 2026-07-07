import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Search, Shield, ShieldCheck, UserMinus, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import ConfirmModal from "../../components/ConfirmModal";

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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 bg-white space-y-6"
    >
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">User Directory</h3>
          <p className="text-slate-400 text-xs mt-1">Manage volunteer ranks, promote administrators, and audit profiles.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-2xl border border-slate-200 py-2 pl-9 pr-4 text-slate-850 placeholder-slate-400 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary text-xs"
          />
        </div>

        <div className="flex gap-2">
          {["All", "Volunteer", "Admin", "Super Admin"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleFilter === role
                  ? "bg-primary text-white"
                  : "bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="space-y-3 py-6">
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs">
          No users match your criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">XP Points</th>
                <th className="py-3 px-4 text-center">Hours</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 text-xs font-semibold">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-slate-800">{user.displayName}</p>
                      <p className="text-[10px] text-slate-450 mt-0.5">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={user.role || "Volunteer"}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      disabled={!isSuperAdmin || user.id === currentUser.uid}
                      className="rounded-lg border border-slate-200 py-1 px-2.5 text-xs text-slate-700 font-semibold bg-white cursor-pointer disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-500"
                    >
                      <option value="Volunteer">Volunteer</option>
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-center text-primary font-bold">{user.xp || 0}</td>
                  <td className="py-3.5 px-4 text-center text-slate-600">{user.hours || 0} Hrs</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={user.id === currentUser.uid || (!isSuperAdmin && user.role !== "Volunteer")}
                        className={`p-1.5 rounded-lg border cursor-pointer transition-colors disabled:opacity-35 disabled:cursor-not-allowed ${
                          user.suspended
                            ? "bg-rose-50 border-rose-100 text-rose-600"
                            : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700"
                        }`}
                        title={user.suspended ? "Activate account" : "Suspend account"}
                      >
                        {user.suspended ? <ToggleRight className="h-4.5 w-4.5" /> : <ToggleLeft className="h-4.5 w-4.5" />}
                      </button>
                      <button
                        onClick={() => triggerDeleteConfirm(user.id)}
                        disabled={user.id === currentUser.uid || (!isSuperAdmin && user.role !== "Volunteer")}
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                        title="Delete user"
                      >
                        <UserMinus className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
