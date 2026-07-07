import React from 'react';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';



export default function Blogs() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2563EB] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      <PublicNavbar />
      


      {/* Indu Aggarwal Intro */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-[#E2E8F0] flex flex-col"
          >
            <div className="relative w-full bg-slate-50 border-b border-[#E2E8F0]">
              <img 
                src="/indu_aggarwal_about.jpg" 
                alt="Indu Aggarwal" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#2563EB] tracking-wide uppercase shadow-sm">
                We Make The Difference
              </div>
            </div>
            <div className="p-8 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 text-slate-900 leading-tight">
                Indu Aggarwal
              </h2>
              <div className="text-sm font-bold text-[#2563EB] uppercase tracking-wide mb-8">
                Entrepreneur & Emotional Wellness Coach
              </div>
              <p className="text-slate-600 text-lg md:text-xl mb-6 leading-relaxed max-w-3xl mx-auto">
                Indu Aggarwal is enriching everyone’s lives by being the LEADING LIGHT and touching the lives of people through her Training and Health awareness programs. 
              </p>
              <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                To pursue her passion of making a difference in the lives of people, she said goodbye to her lucrative corporate career and started her organization “DISHA FOR SUCCESS” and “DISHA FOR INDIA FOUNDATION AND EDUCATIONAL TRUST.”
              </p>
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
