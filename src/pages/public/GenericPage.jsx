import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';
import { motion } from 'framer-motion';

const AnimatedHighlight = ({ children, color = "bg-sky-200/60" }) => (
  <span className="relative inline-block whitespace-nowrap">
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      style={{ originX: 0 }}
      className={`absolute inset-0 ${color} rounded-sm -z-10`}
    />
    <span className="relative z-10">{children}</span>
  </span>
);

const pageData = {
  'help-center': { 
    title: 'Help Center', 
    isComplete: true,
    content: (
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-800 mb-6"><AnimatedHighlight color="bg-sky-200/80">Welcome to the Disha For India Help Center</AnimatedHighlight></h2>
          <p className="text-lg text-slate-600">We're here to help you with volunteering, programs, registrations, partnerships, donations, and general inquiries. Browse the topics below to find quick answers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Volunteer Support */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-indigo-100/60">Volunteer Support</AnimatedHighlight></h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">How do I become a volunteer?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Visit the <strong>Volunteer Registration</strong> page, complete the application form, and our team will contact you with the next steps.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Is there any registration fee?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Most volunteer opportunities are free to join. Any program-specific requirements will be mentioned during registration.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Can students volunteer?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Yes. Students, working professionals, and individuals passionate about community service are welcome to participate.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Will I receive a certificate?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Eligible volunteers receive a certificate of participation after successfully completing the required activities.</p>
              </div>
            </div>
          </motion.div>

          {/* Programs & Events */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-emerald-100/60">Programs & Events</AnimatedHighlight></h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">How can I join a program?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Browse our available programs, choose the one that interests you, and complete the registration process.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Are programs available online?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Some workshops and awareness sessions are conducted online, while community activities are held on-site.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Can I participate in multiple programs?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Yes. You may join multiple initiatives based on your interests and availability.</p>
              </div>
            </div>
          </motion.div>

          {/* Donations & Partnerships */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-rose-100/60">Donations & Partnerships</AnimatedHighlight></h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">How can I support Disha For India?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">You can support us by volunteering, donating, partnering with us, or spreading awareness about our initiatives.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">How do I become a partner?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Organizations, institutions, and businesses can contact us through the Partnership or Contact page to discuss collaboration opportunities.</p>
              </div>
            </div>
          </motion.div>

          {/* Account & Registration */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-amber-100/60">Account & Registration</AnimatedHighlight></h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">How do I update my information?</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Please contact our support team with your updated details, and we will assist you.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">I didn't receive a confirmation email.</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Check your Spam or Promotions folder. If you still can't find it, contact our support team for assistance.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} className="bg-gradient-to-br from-sky-50 to-indigo-50 p-8 rounded-2xl border border-sky-100 mt-12 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-3"><AnimatedHighlight color="bg-white/80">Still Need Help?</AnimatedHighlight></h2>
          <p className="text-blue-800/80 mb-6 font-medium">If your question isn't answered here, we're always ready to help you directly.</p>
          <p>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Contact Support
            </Link>
          </p>
        </motion.div>
      </div>
    )
  },
  'volunteer-guidelines': { 
    title: 'Volunteer Guidelines', 
    content: <p>Our volunteers are the backbone of DISHA. Review our core values, code of conduct, and operational guidelines.</p>,
    isComplete: false
  },
  'ngo-portal': { 
    title: 'NGO Portal Information', 
    content: <p>Information for partner NGOs. Learn how to list your organization, post volunteering opportunities, and verify hours.</p>,
    isComplete: false
  },
  'privacy-policy': { 
    title: 'Privacy Policy', 
    isComplete: true,
    content: (
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-800 mb-6"><AnimatedHighlight color="bg-sky-200/80">Privacy Policy</AnimatedHighlight></h2>
          <p className="font-medium text-slate-500 mb-4"><strong>Last Updated:</strong> July 2026</p>
          <p className="text-lg text-slate-600">At <strong>Disha For India</strong>, we value your privacy and are committed to protecting your personal information.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Information We Collect */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-sky-100/60">Information We Collect</AnimatedHighlight></h3>
            <p className="mb-4 text-slate-600">We may collect:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Name & Contact Details</li>
              <li>Email address & Phone number</li>
              <li>Location & Address</li>
              <li>Volunteer registration details</li>
              <li>Messages submitted through our contact forms</li>
            </ul>
          </motion.div>

          {/* How We Use Your Information */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-indigo-100/60">How We Use Information</AnimatedHighlight></h3>
            <p className="mb-4 text-slate-600">Your information is used to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Register volunteers & members</li>
              <li>Respond to inquiries & support requests</li>
              <li>Share program updates and events</li>
              <li>Improve our platform & services</li>
              <li>Maintain communication regarding campaigns</li>
            </ul>
          </motion.div>

          {/* Data Security */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-emerald-100/60">Data Security</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure. We use secure servers and standard encryption protocols to ensure data safety.
            </p>
          </motion.div>

          {/* Third-Party Sharing */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-rose-100/60">Third-Party Sharing</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              We <strong>never</strong> sell or rent your personal information. Information may only be shared with trusted partners or authorities when necessary to deliver our programs or comply with strict legal obligations.
            </p>
          </motion.div>

          {/* Your Rights */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-amber-100/60">Your Rights</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              You retain full control over your data. You may request access, correction, or deletion of your personal information at any time by contacting our privacy compliance team.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-sky-100/60">Contact Us</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy, please reach out to us through our secure Contact page.
            </p>
            <div className="mt-4">
              <Link to="/contact" className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1">
                Contact Privacy Team
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  },
  'terms-of-service': { 
    title: 'Terms of Service', 
    isComplete: true,
    content: (
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-800 mb-6"><AnimatedHighlight color="bg-sky-200/80">Terms of Service</AnimatedHighlight></h2>
          <p className="font-medium text-slate-500 mb-4"><strong>Last Updated:</strong> July 2026</p>
          <p className="text-lg text-slate-600">Welcome to <strong>Disha For India</strong>. By accessing or using our website, you agree to these Terms of Service.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Use of Website */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-sky-100/60">Use of Website</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              You agree to use this website only for lawful purposes and in a respectful manner. You must not use our platform in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.
            </p>
          </motion.div>

          {/* Volunteer Participation */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-indigo-100/60">Volunteer Participation</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              Participation in our programs is entirely voluntary. Volunteers are expected to follow organizational guidelines, maintain professional conduct, and uphold the values of the Disha For India foundation.
            </p>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-emerald-100/60">Intellectual Property</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              All website content, including text, graphics, logos, and images, is the property of Disha For India unless otherwise stated. Unauthorized use of this property is strictly prohibited.
            </p>
          </motion.div>

          {/* User Content */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-amber-100/60">User Content</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              By submitting information through forms or participating in activities, you grant us permission to use the content for communication, awareness, and organizational purposes.
            </p>
          </motion.div>

          {/* Limitation of Liability */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-rose-100/60">Limitation of Liability</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              Disha For India is not responsible for any direct or indirect damages arising from the use of this website or participation in our physical or virtual activities.
            </p>
          </motion.div>

          {/* Changes to Terms */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-sky-100/60">Changes to Terms</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              We may update these Terms of Service at any time without prior notice. Continued use of the website constitutes your acceptance of the revised terms.
            </p>
          </motion.div>
        </div>
      </div>
    )
  },
  'cookie-policy': { 
    title: 'Cookie Policy', 
    isComplete: true,
    content: (
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-800 mb-6"><AnimatedHighlight color="bg-sky-200/80">Cookie Policy</AnimatedHighlight></h2>
          <p className="font-medium text-slate-500 mb-4"><strong>Last Updated:</strong> July 2026</p>
          <p className="text-lg text-slate-600">This website uses cookies to improve your browsing experience and provide tailored services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What Are Cookies? */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-sky-100/60">What Are Cookies?</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              Cookies are small text files stored on your device that help the website function efficiently. They allow us to recognize your device and remember your preferences.
            </p>
          </motion.div>

          {/* Why We Use Cookies */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-indigo-100/60">Why We Use Cookies</AnimatedHighlight></h3>
            <p className="mb-4 text-slate-600">We use cookies to:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Remember your site preferences</li>
              <li>Improve website speed and performance</li>
              <li>Analyze anonymous visitor traffic</li>
              <li>Enhance overall user experience</li>
            </ul>
          </motion.div>

          {/* Managing Cookies */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-emerald-100/60">Managing Cookies</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              You can control, block, or disable cookies through your browser settings at any time. However, some core features of the website may not function properly if cookies are disabled.
            </p>
          </motion.div>

          {/* Third-Party Cookies */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-amber-100/60">Third-Party Cookies</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              We may use trusted analytics services (such as Google Analytics) that place cookies to help us understand website usage and improve our community outreach.
            </p>
          </motion.div>

          {/* Updates */}
          <motion.div whileHover={{ y: -4 }} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4"><AnimatedHighlight color="bg-rose-100/60">Updates</AnimatedHighlight></h3>
            <p className="text-slate-600 leading-relaxed">
              This Cookie Policy may be updated periodically to reflect changes in technology, privacy laws, or operational requirements. We recommend checking back regularly.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }
};

export default function GenericPage() {
  const { pageId } = useParams();
  const data = pageData[pageId] || { title: 'Page Not Found', content: <p>The page you are looking for does not exist.</p>, isComplete: false };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      <PublicNavbar />
      
      <div className="flex-grow max-w-4xl mx-auto w-full px-6 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/" className="text-[#0EA5E9] font-bold text-sm hover:underline mb-4 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight font-display">
            {data.title.split(' ').slice(0, -1).join(' ')}{' '}
            <AnimatedHighlight color="bg-sky-200/80">
              {data.title.split(' ').slice(-1)}
            </AnimatedHighlight>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-[#E2E8F0] relative overflow-hidden"
        >
          {/* Decorative element */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00D09C] to-[#0066FF]"></div>
          
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6 text-lg">
            <div className="text-slate-700 leading-relaxed">
              {data.content}
            </div>
            
            {!data.isComplete && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="mb-4">
                  This section is currently under active development. Our legal and support teams are finalizing the comprehensive documentation for this page.
                </p>
                <p>
                  If you have any urgent inquiries regarding our {data.title.toLowerCase()}, please reach out to us directly via our <Link to="/contact" className="text-[#0EA5E9] font-bold hover:underline">Contact Page</Link>.
                </p>
              </div>
            )}
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-slate-400 font-medium gap-2">
              <span>DISHA FOR INDIA</span>
              {data.isComplete && (
                <span>Last reviewed: July 2026</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
