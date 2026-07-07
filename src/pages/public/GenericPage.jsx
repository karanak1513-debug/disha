import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';

const pageData = {
  'help-center': { 
    title: 'Help Center', 
    isComplete: true,
    content: (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to the Disha For India Help Center</h2>
          <p>We're here to help you with volunteering, programs, registrations, partnerships, donations, and general inquiries. Browse the topics below to find quick answers.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Volunteer Support</h2>
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">How do I become a volunteer?</h3>
          <p>Visit the <strong>Volunteer Registration</strong> page, complete the application form, and our team will contact you with the next steps.</p>
          
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">Is there any registration fee?</h3>
          <p>Most volunteer opportunities are free to join. Any program-specific requirements will be mentioned during registration.</p>
          
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">Can students volunteer?</h3>
          <p>Yes. Students, working professionals, and individuals passionate about community service are welcome to participate.</p>
          
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">Will I receive a certificate?</h3>
          <p>Eligible volunteers receive a certificate of participation after successfully completing the required activities.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Programs & Events</h2>
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">How can I join a program?</h3>
          <p>Browse our available programs, choose the one that interests you, and complete the registration process.</p>
          
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">Are programs available online?</h3>
          <p>Some workshops and awareness sessions are conducted online, while community activities are held on-site.</p>
          
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">Can I participate in multiple programs?</h3>
          <p>Yes. You may join multiple initiatives based on your interests and availability.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Donations & Partnerships</h2>
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">How can I support Disha For India?</h3>
          <p>You can support us by volunteering, donating, partnering with us, or spreading awareness about our initiatives.</p>
          
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">How do I become a partner?</h3>
          <p>Organizations, institutions, and businesses can contact us through the Partnership or Contact page to discuss collaboration opportunities.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Account & Registration</h2>
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">How do I update my information?</h3>
          <p>Please contact our support team with your updated details, and we will assist you.</p>
          
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">I didn't receive a confirmation email.</h3>
          <p>Check your Spam or Promotions folder. If you still can't find it, contact our support team for assistance.</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2">Technical Support</h2>
          <h3 className="text-lg font-bold text-slate-700 mt-6 mb-2">I'm having trouble accessing the website.</h3>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Refresh your browser.</li>
            <li>Clear your browser cache.</li>
            <li>Try another browser or device.</li>
            <li>Ensure you have a stable internet connection.</li>
          </ul>
          <p className="mt-4">If the issue continues, please contact our support team.</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-8">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Still Need Help?</h2>
          <p className="text-blue-800 mb-4">If you couldn't find the answer you're looking for, we're happy to help. Submit your query through our Contact Us page, and our team will get back to you as soon as possible.</p>
          <Link to="/contact" className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Contact Support
          </Link>
        </div>
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
      <div className="space-y-6">
        <p className="font-medium"><strong>Last Updated:</strong> July 2026</p>
        <p>At <strong>Disha For India</strong>, we value your privacy and are committed to protecting your personal information.</p>
        
        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Information We Collect</h3>
        <p>We may collect:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Location</li>
          <li>Volunteer registration details</li>
          <li>Messages submitted through our contact forms</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">How We Use Your Information</h3>
        <p>Your information is used to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Register volunteers</li>
          <li>Respond to inquiries</li>
          <li>Share program updates and events</li>
          <li>Improve our services</li>
          <li>Maintain communication regarding campaigns and initiatives</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Third-Party Sharing</h3>
        <p>We do not sell or rent your personal information. Information may only be shared with trusted partners when necessary to deliver our programs or comply with legal obligations.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Your Rights</h3>
        <p>You may request access, correction, or deletion of your personal information by contacting us.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Contact</h3>
        <p>If you have any questions regarding this Privacy Policy, please contact us through our Contact Us page.</p>
      </div>
    )
  },
  'terms-of-service': { 
    title: 'Terms of Service', 
    isComplete: true,
    content: (
      <div className="space-y-6">
        <p className="font-medium"><strong>Last Updated:</strong> July 2026</p>
        <p>Welcome to <strong>Disha For India</strong>.</p>
        <p>By accessing or using our website, you agree to these Terms of Service.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Use of Website</h3>
        <p>You agree to use this website only for lawful purposes and in a respectful manner.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Volunteer Participation</h3>
        <p>Participation in our programs is voluntary. Volunteers are expected to follow organizational guidelines and maintain professional conduct.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Intellectual Property</h3>
        <p>All website content, including text, graphics, logos, and images, is the property of Disha For India unless otherwise stated.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">User Content</h3>
        <p>By submitting information through forms or participating in activities, you grant us permission to use the content for communication and organizational purposes.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Limitation of Liability</h3>
        <p>Disha For India is not responsible for any direct or indirect damages arising from the use of this website or participation in our activities.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Changes to Terms</h3>
        <p>We may update these Terms of Service at any time. Continued use of the website constitutes acceptance of the revised terms.</p>
      </div>
    )
  },
  'cookie-policy': { 
    title: 'Cookie Policy', 
    isComplete: true,
    content: (
      <div className="space-y-6">
        <p className="font-medium"><strong>Last Updated:</strong> July 2026</p>
        <p>This website uses cookies to improve your browsing experience.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">What Are Cookies?</h3>
        <p>Cookies are small text files stored on your device that help the website function efficiently.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Why We Use Cookies</h3>
        <p>We use cookies to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Remember your preferences</li>
          <li>Improve website performance</li>
          <li>Analyze visitor traffic</li>
          <li>Enhance user experience</li>
        </ul>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Managing Cookies</h3>
        <p>You can control or disable cookies through your browser settings. Some features of the website may not function properly if cookies are disabled.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Third-Party Cookies</h3>
        <p>We may use trusted analytics services that place cookies to help us understand website usage.</p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Updates</h3>
        <p>This Cookie Policy may be updated periodically to reflect changes in technology or legal requirements.</p>
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
        <div className="mb-10">
          <Link to="/" className="text-[#2563EB] font-bold text-sm hover:underline mb-4 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">{data.title}</h1>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-[0_20px_60px_-15px_rgb(0,0,0,0.05)] border border-[#E2E8F0] relative overflow-hidden">
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
                  If you have any urgent inquiries regarding our {data.title.toLowerCase()}, please reach out to us directly via our <Link to="/contact" className="text-[#2563EB] font-bold hover:underline">Contact Page</Link>.
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
        </div>
      </div>

      <Footer />
    </div>
  );
}
