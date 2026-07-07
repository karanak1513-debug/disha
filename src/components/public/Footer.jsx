import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Twitter, Instagram, Linkedin, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#0B1120] pt-24 pb-12 overflow-hidden border-t border-slate-800">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-black text-xl shadow-lg shadow-blue-500/25">
                D
              </div>
              <span className="font-extrabold text-white text-2xl tracking-tight">DISHA FOR INDIA</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-medium mb-8">
              Empowering India's youth through structured volunteering, skill development, and verifiable impact. Join us in building a better tomorrow.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md">
              <div className="relative w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-[#1E293B]/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all backdrop-blur-sm" 
                />
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25 whitespace-nowrap group">
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Links: Resources */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />Help Center</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />Volunteer Guidelines</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />Blog</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />NGO Portal</a></li>
            </ul>
          </div>

          {/* Links: Support */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />Contact Us</Link></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />FAQ</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />Feedback</a></li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>© {new Date().getFullYear()} DISHA for India.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
            <span className="flex items-center gap-1 ml-2">
              Built with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for India.
            </span>
          </div>
          
          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all">
              <Globe className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-400 transition-all">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 transition-all">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-700 transition-all">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
