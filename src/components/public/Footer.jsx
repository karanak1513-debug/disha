import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-[#E2E8F0] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-16">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold text-lg shadow-sm">D</span>
              <span className="font-bold text-[#0F172A] text-xl tracking-tight">DISHA FOR INDIA</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Empowering India's youth through structured volunteering, skill development, and verifiable impact.
            </p>
          </div>
          
          <div className="flex gap-16">
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Navigation</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Home</Link></li>
                <li><Link to="/impact" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Our Impact</Link></li>
                <li><Link to="/blogs" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Blogs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0F172A] mb-4">Support</h4>
              <ul className="space-y-3">
                <li><Link to="/contact" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-400">
            © {new Date().getFullYear()} DISHA for India. All rights reserved. Built with ❤️ for India.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-[#2563EB] transition-colors"><Globe className="h-5 w-5" /></a>
            {/* Add social icons here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
