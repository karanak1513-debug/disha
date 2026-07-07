import React, { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { motion } from "framer-motion";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function AdminBlogPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "blogPhotos"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openCreateModal = () => {
    setTitle("");
    setDescription("");
    setImageURL("");
    setShowModal(true);
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!title || !imageURL) {
      return toast.error("Please provide a title and image URL.");
    }

    const payload = {
      title,
      description,
      imageURL,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "blogPhotos"), payload);
      toast.success("Photo added successfully!");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add photo");
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deleteDoc(doc(db, "blogPhotos", id));
      toast.success("Photo deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete photo");
    }
  };

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
              <span className="text-slate-800 font-semibold">Blog Photos</span>
            </motion.div>
          </div>
          
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.2}} className="flex-shrink-0 flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex flex-col items-end border-r border-slate-200 pr-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Photos</span>
              <span className="text-2xl font-black text-slate-800">{photos.length}</span>
            </div>
            <button
              onClick={openCreateModal}
              className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all active:scale-95"
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
            <div key={n} className="h-[300px] bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center justify-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <ImageIcon className="h-8 w-8 text-slate-300" />
          </div>
          No blog photos added yet. Click the "+" button to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <motion.div variants={fadeUp} key={photo.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all duration-300">
              <div className="h-48 relative overflow-hidden bg-slate-100">
                <img
                  src={photo.imageURL}
                  alt={photo.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1 mb-1.5">{photo.title}</h4>
                  <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">{photo.description}</p>
                </div>

                <div className="flex items-center justify-end mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs font-bold">Remove</span>
                  </button>
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
            className="relative w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl border border-slate-100 overflow-y-auto max-h-[90vh] z-10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Add New Photo</h3>
                <p className="text-slate-500 text-xs mt-1 font-medium">Upload a new image for the blog gallery.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Village Drive 2026"
                  className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Image URL *</label>
                <input
                  type="text"
                  required
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="A short caption for this photo..."
                  className="block w-full rounded-xl border border-slate-200 py-3 px-4 text-[13px] font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50"
                />
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
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98]"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
