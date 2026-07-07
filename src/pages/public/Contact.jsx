import React from 'react';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-black selection:text-white">
      <PublicNavbar />
      
      <main className="pt-32 pb-24 md:pt-48 md:pb-32 px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mb-20 md:mb-32"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Let's start a conversation.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed">
            Whether you want to volunteer, partner with us, or simply learn more about our mission, our team is ready to help.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-16 md:gap-24">
          
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3"
          >
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    className="w-full border-b-2 border-slate-200 py-3 bg-transparent focus:outline-none focus:border-black transition-colors text-lg"
                    placeholder="Jane"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full border-b-2 border-slate-200 py-3 bg-transparent focus:outline-none focus:border-black transition-colors text-lg"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  className="w-full border-b-2 border-slate-200 py-3 bg-transparent focus:outline-none focus:border-black transition-colors text-lg"
                  placeholder="jane@example.com"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-wider">Message</label>
                <textarea 
                  rows="4"
                  className="w-full border-b-2 border-slate-200 py-3 bg-transparent focus:outline-none focus:border-black transition-colors text-lg resize-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="bg-black text-white px-10 py-4 rounded-full font-bold tracking-wide hover:bg-slate-800 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </motion.div>

          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-12 md:pl-8 lg:pl-12 md:border-l border-slate-100"
          >
            <div>
              <h3 className="flex items-center gap-3 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                <Mail className="w-5 h-5 text-slate-400" /> Email
              </h3>
              <a href="mailto:hello@disha.org.in" className="text-lg text-slate-500 hover:text-black transition-colors">hello@disha.org.in</a>
            </div>
            
            <div>
              <h3 className="flex items-center gap-3 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                <Phone className="w-5 h-5 text-slate-400" /> Phone
              </h3>
              <a href="tel:+919876543210" className="text-lg text-slate-500 hover:text-black transition-colors">+91 98765 43210</a>
            </div>

            <div>
              <h3 className="flex items-center gap-3 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                <MapPin className="w-5 h-5 text-slate-400" /> Headquarters
              </h3>
              <address className="text-lg text-slate-500 not-italic leading-relaxed">
                123 Innovation Block<br />
                Tech Park, Bangalore<br />
                India 560100
              </address>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
