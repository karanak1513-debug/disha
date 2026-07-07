import React from 'react';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import { motion } from 'framer-motion';
import { Heart, Globe, Users, Star } from 'lucide-react';

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1593113565637-2af5fc9f5922?q=80&w=2940&auto=format&fit=crop", alt: "Volunteers teaching children", size: "large" },
  { src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2946&auto=format&fit=crop", alt: "Community clean up", size: "small" },
  { src: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2874&auto=format&fit=crop", alt: "Food distribution", size: "medium" },
  { src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop", alt: "Helping the elderly", size: "small" },
  { src: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2940&auto=format&fit=crop", alt: "Skill development workshop", size: "medium" },
  { src: "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?q=80&w=2864&auto=format&fit=crop", alt: "Healthcare camp", size: "large" },
];

export default function Impact() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#2563EB] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/3 translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight font-display mb-6"
          >
            Our Real-World <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Impact</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12"
          >
            See how our network of dedicated volunteers is transforming communities across India every single day.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Users, label: "Volunteers", value: "50,000+" },
              { icon: Globe, label: "Cities", value: "120+" },
              { icon: Heart, label: "Lives Touched", value: "1M+" },
              { icon: Star, label: "NGO Partners", value: "500+" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
              >
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white font-display mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Moments of Impact</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">A glimpse into our initiatives and the smiles we've helped bring across the nation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {galleryImages.map((image, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl overflow-hidden group shadow-sm ${
                  image.size === 'large' ? 'md:col-span-2 md:row-span-2' : 
                  image.size === 'medium' ? 'md:col-span-1 md:row-span-2' : 
                  'md:col-span-1 md:row-span-1'
                }`}
              >
                <div className="absolute inset-0 bg-[#0F172A]/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                  <h3 className="text-white font-bold text-lg">{image.alt}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
