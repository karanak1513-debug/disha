import React from 'react';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';



export default function Blogs() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2563EB] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-white overflow-hidden border-b border-[#E2E8F0]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
          <div className="w-full max-w-7xl relative">
            <div className="absolute -top-24 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-sm font-semibold text-[#2563EB] mb-6"
          >
            DISHA Journal
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight font-display mb-6"
          >
            Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Change</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Insights, updates, and inspiring stories from our volunteers and partners across India.
          </motion.p>
        </div>
      </section>

      {/* Indu Aggarwal Intro */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-[#E2E8F0] grid lg:grid-cols-2"
          >
            <div className="relative overflow-hidden h-64 lg:h-auto">
              <img 
                src="/indu_aggarwal_about.jpg" 
                alt="Indu Aggarwal" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#2563EB] tracking-wide uppercase">
                We Make The Difference
              </div>
            </div>
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl font-bold font-display mb-2 text-slate-900 leading-tight">
                Indu Aggarwal
              </h2>
              <div className="text-sm font-bold text-[#2563EB] uppercase tracking-wide mb-6">
                Entrepreneur & Emotional Wellness Coach
              </div>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                Indu Aggarwal is enriching everyone’s lives by being the LEADING LIGHT and touching the lives of people through her Training and Health awareness programs. 
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
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
