import React from 'react';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';

const blogPosts = [
  {
    title: "How Student Volunteering is Shaping the Future of Education",
    excerpt: "Discover the transformative power of peer-to-peer mentoring and how our latest initiative is bringing quality education to remote villages.",
    category: "Education",
    author: "Priya Sharma",
    date: "Oct 12, 2026",
    readTime: "5 min read",
    image: "/volunteers_teaching_1783425889312.png"
  },
  {
    title: "Sustainability 101: Starting a Community Garden",
    excerpt: "A step-by-step guide to mobilizing your neighborhood and creating a sustainable source of fresh produce.",
    category: "Environment",
    author: "Rahul Verma",
    date: "Oct 08, 2026",
    readTime: "7 min read",
    image: "/volunteers_planting_1783425900568.png"
  },
  {
    title: "The Silent Pandemic: Addressing Mental Health in Youth",
    excerpt: "Our mental health awareness campaign reached over 10,000 students this month. Here's what we learned.",
    category: "Health",
    author: "Dr. Aisha Khan",
    date: "Oct 01, 2026",
    readTime: "6 min read",
    image: "/volunteers_tech_1783425911491.png"
  }
];

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

      {/* Featured Post */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-[#E2E8F0] grid lg:grid-cols-2 group cursor-pointer"
          >
            <div className="relative overflow-hidden h-64 lg:h-auto">
              <img 
                src="/impact_header_1783425922341.png" 
                alt="Featured Post" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#2563EB] tracking-wide uppercase">
                Featured
              </div>
            </div>
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium mb-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Oct 15, 2026</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 10 min read</span>
              </div>
              <h2 className="text-3xl font-bold font-display mb-6 group-hover:text-[#2563EB] transition-colors leading-tight">
                The Mega Clean-Up Drive: Restoring our Coastlines
              </h2>
              <p className="text-slate-500 text-lg mb-8 line-clamp-3">
                Last weekend, over 5,000 volunteers across 12 coastal cities came together to remove 20 tonnes of plastic waste from our beaches. This is the story of how collective action is saving marine life.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Author" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Karan Singh</div>
                    <div className="text-xs text-slate-500">Environmental Lead</div>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-[#E2E8F0] flex items-center justify-center text-slate-400 group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-bold font-display">Recent Articles</h3>
            <button className="text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] transition-colors flex items-center gap-2">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] group cursor-pointer hover:shadow-xl transition-all"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-3">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h4 className="text-xl font-bold font-display mb-3 group-hover:text-[#2563EB] transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900 border-t border-[#E2E8F0] pt-4">
                    <User className="w-4 h-4 text-slate-400" />
                    {post.author}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
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
            <img src="/blog_gallery_1_1783425941447.png" className="rounded-2xl h-48 w-full object-cover" alt="Gallery 1" />
            <img src="/blog_gallery_2_1783425951701.png" className="rounded-2xl h-48 w-full object-cover" alt="Gallery 2" />
            <img src="/blog_gallery_3_1783425963593.png" className="rounded-2xl h-48 w-full object-cover" alt="Gallery 3" />
            <img src="/blog_gallery_4_1783425974837.png" className="rounded-2xl h-48 w-full object-cover" alt="Gallery 4" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
