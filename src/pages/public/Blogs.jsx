import React from 'react';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

// --- ANIMATION VARIANTS ---
const textReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};



export default function Blogs() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2563EB] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      <PublicNavbar />
      


      {/* Indu Aggarwal Intro */}
      <section className="py-24 relative overflow-hidden bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
            className="relative bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden grid lg:grid-cols-2 group"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative h-[400px] lg:h-auto bg-slate-50 flex items-center justify-center p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent opacity-50" />
              <img 
                src="/indu_aggarwal_about.jpg" 
                alt="Indu Aggarwal" 
                className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] drop-shadow-xl rounded-2xl"
              />
              <div className="absolute top-8 left-8 z-20 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-xs font-bold text-blue-600 tracking-wider uppercase border border-white">
                We Make The Difference
              </div>
            </div>
            
            <div className="p-10 lg:p-20 flex flex-col justify-center relative z-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px] bg-blue-600"></span>
                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                  Leadership
                </span>
              </div>
              
              <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={textReveal} className="text-4xl lg:text-5xl font-bold font-display mb-4 text-slate-900 tracking-tighter leading-tight">
                Indu Aggarwal
              </motion.h2>
              <div className="text-lg font-medium text-slate-500 mb-8 pb-8 border-b border-slate-100">
                Entrepreneur & Emotional Wellness Coach
              </div>
              
              <div className="space-y-6 relative">
                <p className="text-slate-500 text-xl leading-relaxed tracking-wide relative z-10">
                  <span className="text-6xl text-blue-100 font-serif absolute -top-6 -left-6 -z-10 opacity-50">"</span>
                  Indu Aggarwal is enriching everyone’s lives by being the LEADING LIGHT and touching the lives of people through her Training and Health awareness programs.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                  To pursue her passion of making a difference in the lives of people, she said goodbye to her lucrative corporate career and started her organization <span className="font-semibold text-slate-900">“DISHA FOR SUCCESS”</span> and <span className="font-semibold text-slate-900">“DISHA FOR INDIA FOUNDATION AND EDUCATIONAL TRUST.”</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Visual Impact Gallery */}
      <section className="py-24 bg-[#0F172A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">A Picture Speaks a Thousand Words</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Browse through our curated gallery of ongoing field events.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img src="/blog_gallery_new_2.jpg" className="rounded-2xl h-48 w-full object-cover" alt="Gallery 1" />
            <img src="/blog_gallery_new_3.png" className="rounded-2xl h-48 w-full object-cover" alt="Gallery 2" />
            <img src="/blog_gallery_new_4.png" className="rounded-2xl h-48 w-full object-cover" alt="Gallery 3" />
            <img src="/blog_gallery_new_5.jpg" className="rounded-2xl h-48 w-full object-cover" alt="Gallery 4" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
