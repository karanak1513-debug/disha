import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function BlogsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const galleryItems = [
    {
      title: "Flood Relief Camp 2026",
      category: "Emergency Response",
      image: "/blog_gallery_1_1783425941447.png",
      span: "md:col-span-2 md:row-span-2"
    },
    {
      title: "Tree Plantation Drive",
      category: "Environment",
      image: "/blog_gallery_2_1783425951701.png",
      span: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Back to School Initiative",
      category: "Education",
      image: "/blog_gallery_3_1783425963593.png",
      span: "md:col-span-1 md:row-span-2"
    },
    {
      title: "Coastal Cleanup",
      category: "Environment",
      image: "/blog_gallery_4_1783425974837.png",
      span: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Tech for Elderly",
      category: "Digital Literacy",
      image: "/volunteers_tech_1783425911491.png",
      span: "md:col-span-2 md:row-span-1"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#0F172A]">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-[#E2E8F0] py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold text-lg shadow-sm">D</span>
            <span className="font-bold text-slate-900 text-xl tracking-tight hidden sm:block">DISHA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Home</Link>
            <Link to="/our-programs" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Programs</Link>
            <Link to="/our-impact" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Impact</Link>
            <Link to="/blogs" className="text-sm font-bold text-[#2563EB]">Blogs</Link>
          </div>
          <Link to="/register" className="inline-flex items-center justify-center rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] shadow-sm">
            Volunteer Now
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-6">Our Stories</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6 text-[#0F172A]">Blogs & Gallery</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Explore the amazing work our volunteers are doing on the ground. Real stories, real impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryItems.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-3xl overflow-hidden bg-slate-200 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 break-inside-avoid"
              >
                <img src={item.image} alt={item.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-widest uppercase w-fit mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <div className="flex items-center gap-2 text-[#38BDF8] font-semibold text-sm mt-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    Read Story <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
