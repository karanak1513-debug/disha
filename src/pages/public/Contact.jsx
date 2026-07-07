import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import LoginModal from '../../components/public/LoginModal';
import { Mail, Phone, MapPin, Send, ArrowRight, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AnimatedHighlight = ({ children, color = "bg-sky-200/60" }) => (
  <span className="relative inline-block whitespace-nowrap">
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      style={{ originX: 0 }}
      className={`absolute inset-0 ${color} rounded-sm -z-10`}
    />
    <span className="relative z-10">{children}</span>
  </span>
);

export default function Contact() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#0EA5E9] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-white overflow-hidden border-b border-[#E2E8F0]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-[#0F172A] tracking-tight font-display mb-6"
          >
            Get in <AnimatedHighlight color="bg-sky-200/80">Touch</AnimatedHighlight>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium"
          >
            Have a question about volunteering? Want to partner with us? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-[#E2E8F0] hover:shadow-xl hover:border-sky-200 transition-all text-center flex flex-col items-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 text-[#0EA5E9] group-hover:scale-110 transition-transform duration-300 relative z-10">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Email Us</h3>
              <p className="text-slate-500 mb-6 relative z-10">Our friendly team is here to help.</p>
              <a href="mailto:inaggarwal76@gmail.com" className="text-[#0EA5E9] font-bold hover:underline mt-auto relative z-10">inaggarwal76@gmail.com</a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-[#E2E8F0] hover:shadow-xl hover:border-indigo-200 transition-all text-center flex flex-col items-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 to-indigo-500"></div>

              <div className="w-16 h-16 bg-indigo-50 rounded-[24px] flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <UserCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Dashboard</h3>
              <p className="text-slate-500 mb-6 relative z-10">Access your volunteer portal.</p>
              <div className="flex gap-4 mt-auto w-full justify-center relative z-10">
                <button onClick={() => setIsLoginModalOpen(true)} className="text-[#0EA5E9] font-bold hover:underline cursor-pointer">Login</button>
                <span className="text-slate-300">|</span>
                <Link to="/register" className="text-[#0EA5E9] font-bold hover:underline">Register</Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-[#E2E8F0] hover:shadow-xl hover:border-emerald-200 transition-all text-center flex flex-col items-center group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Call Us</h3>
              <p className="text-slate-500 mb-6 relative z-10">Mon-Fri from 9am to 6pm.</p>
              <a href="tel:+919888877722" className="text-[#0F172A] font-bold hover:text-[#0EA5E9] mt-auto relative z-10">+91-9888877722</a>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}
