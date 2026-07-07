import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-white border-t border-[#E2E8F0] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-bold text-lg shadow-sm">D</span>
              <span className="font-bold text-[#0F172A] text-xl tracking-tight">DISHA FOR INDIA</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed font-medium mb-6">
              Empowering India's youth through structured volunteering, skill development, and verifiable impact.
            </p>
            {/* Newsletter Subscription */}
            <div className="flex items-center gap-2 max-w-xs">
              <input type="email" placeholder="Enter your email" className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
              <button className="bg-[#0F172A] text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Subscribe</button>
            </div>
          </div>
          


          <div>
            <h4 className="font-bold text-[#0F172A] mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Volunteer Guidelines</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">NGO Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0F172A] mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Feedback</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0F172A] mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-[#2563EB] font-medium transition-colors">Cookie Policy</a></li>
            </ul>
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
