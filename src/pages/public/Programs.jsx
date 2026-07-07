import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, BookOpen, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgramsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const programs = [
    {
      title: "Education Initiative",
      desc: "Help children from underprivileged backgrounds get access to quality education.",
      icon: <BookOpen className="h-6 w-6 text-[#2563EB]" />,
      image: "/volunteers_teaching_1783425889312.png"
    },
    {
      title: "Green Earth Project",
      desc: "Participate in nationwide tree-planting drives and environmental conservation.",
      icon: <Leaf className="h-6 w-6 text-[#16A34A]" />,
      image: "/volunteers_planting_1783425900568.png"
    },
    {
      title: "Digital Literacy",
      desc: "Empower the elderly and marginalized communities with basic tech skills.",
      icon: <Monitor className="h-6 w-6 text-[#9333EA]" />,
      image: "/volunteers_tech_1783425911491.png"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A]">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-[#E2E8F0] py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold text-lg shadow-sm">D</span>
            <span className="font-bold text-slate-900 text-xl tracking-tight hidden sm:block">DISHA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Home</Link>
            <Link to="/our-programs" className="text-sm font-bold text-[#2563EB]">Programs</Link>
            <Link to="/our-impact" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Impact</Link>
            <Link to="/blogs" className="text-sm font-semibold text-slate-600 hover:text-[#2563EB] transition-colors">Blogs</Link>
          </div>
          <Link to="/register" className="inline-flex items-center justify-center rounded-[10px] bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#1D4ED8] active:scale-[0.98] shadow-sm">
            Volunteer Now
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="relative py-24 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-6">Our Initiatives</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6 text-[#0F172A]">Programs</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Discover the various ways you can contribute to society. Whether it's teaching, planting trees, or tech training, we have a program for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {programs.map((program, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-3xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 h-12 w-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
                    {program.icon}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{program.title}</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">{program.desc}</p>
                  <Link to="/register" className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] group-hover:translate-x-1 transition-transform">
                    Join this program <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
