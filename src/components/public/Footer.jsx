import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#0B1120] pt-24 pb-12 overflow-hidden border-t border-slate-800">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
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
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25 whitespace-nowrap group">
                Subscribe
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Links: Resources */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Resources</h4>
            <ul className="space-y-4">
              <li><Link to="/p/help-center" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />Help Center</Link></li>
              <li><Link to="/blogs" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />Blog</Link></li>
            </ul>
          </div>

          {/* Links: Support */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />FAQ</Link></li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/p/privacy-policy" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />Privacy Policy</Link></li>
              <li><Link to="/p/terms-of-service" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />Terms of Service</Link></li>
              <li><Link to="/p/cookie-policy" className="text-sm text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />Cookie Policy</Link></li>
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
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-600 transition-all">
              <Globe className="h-5 w-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-400 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-700 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
