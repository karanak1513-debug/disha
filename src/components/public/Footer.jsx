import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart } from 'lucide-react';

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-sm text-slate-400 hover:text-sky-400 font-medium transition-colors">
      {children}
    </Link>
  </li>
);

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#0F172A] pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-14">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0EA5E9] text-white font-bold text-lg">D</div>
                <span className="font-bold text-white text-xl tracking-tight">DISHA <span className="text-sky-400">FOR INDIA</span></span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Empowering India's youth through volunteering, skill development, and community impact. Building a better tomorrow, together.
              </p>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Stay Updated</p>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
                <button className="bg-[#0EA5E9] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0284C7] transition-colors whitespace-nowrap shadow-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs">Resources</h4>
            <ul className="space-y-3">
              <FooterLink to="/p/help-center">Help Center</FooterLink>
              <FooterLink to="/blogs">Blog</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs">Support</h4>
            <ul className="space-y-3">
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-3">
              <FooterLink to="/p/privacy-policy">Privacy Policy</FooterLink>
              <FooterLink to="/p/terms-of-service">Terms of Service</FooterLink>
              <FooterLink to="/p/cookie-policy">Cookie Policy</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>© {new Date().getFullYear()} DISHA for India. All rights reserved.</span>
            <span className="flex items-center gap-1 ml-2">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for India.
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Website" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-all">
              <Globe className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-slate-700 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
