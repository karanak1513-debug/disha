import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import LoginModal from '../../components/public/LoginModal';
import { Mail, Phone, MapPin, Send, ArrowRight, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-[#0EA5E9] selection:text-white font-sans overflow-x-hidden text-[#0F172A]">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight font-display mb-6"
          >
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium"
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
              transition={{ delay: 0.2 }}
              className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 text-[#0EA5E9]">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-slate-500 mb-6">Our friendly team is here to help.</p>
              <a href="mailto:inaggarwal76@gmail.com" className="text-[#0EA5E9] font-semibold hover:underline mt-auto">inaggarwal76@gmail.com</a>
            </motion.div>



            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 hover:shadow-[0_20px_50px_rgb(37,99,235,0.1)] transition-all text-center flex flex-col items-center relative overflow-hidden"
            >
              {/* Highlight line at the top */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00D09C] to-[#0066FF]"></div>

              <div className="w-16 h-16 bg-[#f9f5ff] rounded-[24px] flex items-center justify-center mb-6 text-[#9333ea]">
                <UserCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dashboard</h3>
              <p className="text-slate-500 mb-6">Access your volunteer portal.</p>
              <div className="flex gap-4 mt-auto w-full justify-center">
                <button onClick={() => setIsLoginModalOpen(true)} className="text-[#0EA5E9] font-bold hover:underline cursor-pointer">Login</button>
                <span className="text-slate-200">|</span>
                <Link to="/register" className="text-[#0EA5E9] font-bold hover:underline">Register</Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E2E8F0] hover:shadow-[0_20px_50px_rgb(0,0,0,0.06)] transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-slate-500 mb-6">Mon-Fri from 9am to 6pm.</p>
              <a href="tel:+919888877722" className="text-[#0F172A] font-medium hover:text-[#0EA5E9] mt-auto">+91-9888877722</a>
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
