import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';

const pageData = {
  'help-center': { 
    title: 'Help Center', 
    content: <p>Welcome to the DISHA Help Center. Find guides, tutorials, and support articles to help you navigate our platform.</p>,
    isComplete: false
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
