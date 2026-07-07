import React from 'react';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';



const AnimatedHighlight = ({ children, color = "bg-yellow-200/60" }) => (
  <span className="relative inline-block">
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      style={{ originX: 0 }}
      className={`absolute inset-0 ${color} rounded-sm -z-10`}
    />
    <span className="relative z-10 font-bold text-slate-900">{children}</span>
  </span>
);

export default function Blogs() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#0EA5E9] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      <PublicNavbar />
      


      {/* Indu Aggarwal Intro */}
      <section className="py-24 relative overflow-hidden bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden grid lg:grid-cols-2 group"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-3xl opacity-50 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative h-[400px] lg:h-auto bg-slate-50 flex items-center justify-center p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent opacity-50" />
              <img 
                src="/indu_aggarwal_about.jpg" 
                alt="Indu Aggarwal" 
                className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] drop-shadow-xl rounded-2xl"
              />
              <div className="absolute top-8 left-8 z-20 px-5 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-xs font-bold text-sky-600 tracking-wider uppercase border border-white">
                We Make The Difference
              </div>
            </div>
            
            <div className="p-10 lg:p-20 flex flex-col justify-center relative z-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px] bg-blue-600"></span>
                <span className="text-sm font-bold text-sky-600 uppercase tracking-widest">
                  Leadership
                </span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-display mb-4 text-slate-900 leading-tight">
                Indu Aggarwal
              </h2>
              <div className="text-lg font-medium text-slate-500 mb-8 pb-8 border-b border-slate-100">
                Entrepreneur & Emotional Wellness Coach
              </div>
              
              <div className="space-y-6 relative">
                <p className="text-slate-600 text-lg leading-relaxed relative z-10">
                  <span className="text-6xl text-blue-100 font-serif absolute -top-6 -left-6 -z-10 opacity-50">"</span>
                  Indu Aggarwal is enriching everyone’s lives by being the <AnimatedHighlight color="bg-sky-200/70">LEADING LIGHT</AnimatedHighlight> and touching the lives of people through her Training and Health awareness programs.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                  To pursue her passion of making a difference in the lives of people, she said goodbye to her lucrative corporate career and started her organization <AnimatedHighlight color="bg-indigo-200/70">“DISHA FOR SUCCESS”</AnimatedHighlight> and <AnimatedHighlight color="bg-[#0EA5E9]/20">“DISHA FOR INDIA FOUNDATION AND EDUCATIONAL TRUST.”</AnimatedHighlight>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Visual Impact Gallery */}
      <section className="py-24 bg-white border-t border-[#E2E8F0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 mb-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">A Picture Speaks a Thousand Words</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Browse through our curated gallery of ongoing field events.</p>
          </div>
        </div>

        {/* Infinite Swipe Gallery */}
        <div className="relative w-full overflow-hidden flex items-center">
          {/* Left/Right fading edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <motion.div
            className="flex w-max items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          >
            {/* First Set */}
            <div className="flex gap-4 md:gap-6 pr-4 md:pr-6">
              <img src="/blog_gallery_new_2.jpg" className="shrink-0 rounded-[24px] h-48 md:h-72 w-[280px] md:w-[450px] object-cover shadow-xl border border-slate-100" alt="Gallery 1" />
              <img src="/blog_gallery_new_3.png" className="shrink-0 rounded-[24px] h-48 md:h-72 w-[280px] md:w-[450px] object-cover shadow-xl border border-slate-100" alt="Gallery 2" />
              <img src="/blog_gallery_new_4.png" className="shrink-0 rounded-[24px] h-48 md:h-72 w-[280px] md:w-[450px] object-cover shadow-xl border border-slate-100" alt="Gallery 3" />
              <img src="/blog_gallery_new_5.jpg" className="shrink-0 rounded-[24px] h-48 md:h-72 w-[280px] md:w-[450px] object-cover shadow-xl border border-slate-100" alt="Gallery 4" />
            </div>
            {/* Second Set (Duplicate for seamless loop) */}
            <div className="flex gap-4 md:gap-6 pr-4 md:pr-6">
              <img src="/blog_gallery_new_2.jpg" className="shrink-0 rounded-[24px] h-48 md:h-72 w-[280px] md:w-[450px] object-cover shadow-xl border border-slate-100" alt="Gallery 1" />
              <img src="/blog_gallery_new_3.png" className="shrink-0 rounded-[24px] h-48 md:h-72 w-[280px] md:w-[450px] object-cover shadow-xl border border-slate-100" alt="Gallery 2" />
              <img src="/blog_gallery_new_4.png" className="shrink-0 rounded-[24px] h-48 md:h-72 w-[280px] md:w-[450px] object-cover shadow-xl border border-slate-100" alt="Gallery 3" />
              <img src="/blog_gallery_new_5.jpg" className="shrink-0 rounded-[24px] h-48 md:h-72 w-[280px] md:w-[450px] object-cover shadow-xl border border-slate-100" alt="Gallery 4" />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
