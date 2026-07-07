import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Trash2, Edit, FileText, File, FileImage, Folder, Upload, MoreVertical } from "lucide-react";

export default function AdminResources() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const resourceCategories = ["All", "Guidelines", "Forms", "Assets", "Training"];

  // Mock data for resources
  const [resourcesData, setResourcesData] = useState([
    {
      id: 1,
      title: "Volunteer Handbook 2026",
      description: "Complete guide covering all rules, protocols, and best practices.",
      type: "Guidelines",
      icon: FileText,
      fileSize: "2.4 MB",
      format: "PDF",
      date: "Jul 1, 2026",
      color: "blue"
    },
    {
      id: 2,
      title: "Field Consent Form",
      description: "Required for volunteers conducting activities in specific districts.",
      type: "Forms",
      icon: File,
      fileSize: "156 KB",
      format: "PDF",
      date: "Jun 15, 2026",
      color: "rose"
    },
    {
      id: 3,
      title: "Brand Assets & Logos",
      description: "High-resolution DISHA logos and social media templates.",
      type: "Assets",
      icon: FileImage,
      fileSize: "12.8 MB",
      format: "ZIP",
      date: "May 20, 2026",
      color: "purple"
    },
    {
      id: 4,
      title: "Digital Literacy Toolkit",
      description: "Training materials and slide decks for digital education programs.",
      type: "Training",
      icon: Folder,
      fileSize: "45.2 MB",
      format: "ZIP",
      date: "Jul 5, 2026",
      color: "emerald"
    },
    {
      id: 5,
      title: "Expense Reimbursement Claim",
      description: "Standard template to claim travel and material expenses.",
      type: "Forms",
      icon: File,
      fileSize: "89 KB",
      format: "DOCX",
      date: "Apr 10, 2026",
      color: "amber"
    },
    {
      id: 6,
      title: "Community Outreach Guide",
      description: "Strategies for effective communication with rural communities.",
      type: "Guidelines",
      icon: FileText,
      fileSize: "1.8 MB",
      format: "PDF",
      date: "Jun 28, 2026",
      color: "cyan"
    }
  ]);

  const handleDelete = (id) => {
    setResourcesData(resourcesData.filter((r) => r.id !== id));
  };

  const filteredResources = resourcesData.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(search.toLowerCase()) ||
      res.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || res.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getColorClasses = (color) => {
    switch (color) {
      case "blue": return "bg-blue-50 text-blue-600 border-blue-100";
      case "rose": return "bg-rose-50 text-rose-600 border-rose-100";
      case "purple": return "bg-purple-50 text-purple-600 border-purple-100";
      case "emerald": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "amber": return "bg-amber-50 text-amber-600 border-amber-100";
      case "cyan": return "bg-cyan-50 text-cyan-600 border-cyan-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="space-y-0 pb-8">
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto flex items-center relative overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse-slow" />

        <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <span className="text-slate-800 transition-colors">Administration</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Resources Mgmt</span>
            </motion.div>
          </div>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] xl:min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-blue-600/20 transition-all cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Upload New</span>
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2"
        >
          {resourceCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                filter === cat
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource, i) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, duration: 0.2 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="group relative bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${getColorClasses(resource.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {resource.format}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{resource.type}</span>
                    </div>
                    <h3 className="text-[17px] font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors pr-8">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-400">{resource.fileSize}</span>
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-xs font-semibold text-slate-400">{resource.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer">
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(resource.id)} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No resources found</h3>
            <p className="text-slate-500 max-w-md">
              We couldn't find any resources matching your current search or filter criteria. Try adjusting them.
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
