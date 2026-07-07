import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';

const pageData = {
  'help-center': { 
    title: 'Help Center', 
    content: 'Welcome to the DISHA Help Center. Find guides, tutorials, and support articles to help you navigate our platform.' 
  },
  'volunteer-guidelines': { 
    title: 'Volunteer Guidelines', 
    content: 'Our volunteers are the backbone of DISHA. Review our core values, code of conduct, and operational guidelines.' 
  },
  'ngo-portal': { 
    title: 'NGO Portal Information', 
    content: 'Information for partner NGOs. Learn how to list your organization, post volunteering opportunities, and verify hours.' 
  },
  'faq': { 
    title: 'Frequently Asked Questions', 
    content: 'Find answers to common questions about volunteering, tracking hours, receiving certificates, and more.' 
  },
  'feedback': { 
    title: 'Provide Feedback', 
    content: 'We value your feedback. Let us know how we can improve the DISHA platform for volunteers and NGOs.' 
  },
  'privacy-policy': { 
    title: 'Privacy Policy', 
    content: 'Your privacy is critically important to us. This policy details how we collect, use, and protect your personal data.' 
  },
  'terms-of-service': { 
    title: 'Terms of Service', 
    content: 'By using the DISHA platform, you agree to our terms of service governing user conduct and platform usage.' 
  },
  'cookie-policy': { 
    title: 'Cookie Policy', 
    content: 'We use cookies to improve your browsing experience, analyze site traffic, and understand where our audience comes from.' 
  }
};

export default function GenericPage() {
  const { pageId } = useParams();
  const data = pageData[pageId] || { title: 'Page Not Found', content: 'The page you are looking for does not exist.' };

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
            <p className="font-medium text-slate-800">{data.content}</p>
            <p>
              This section is currently under active development. Our legal and support teams are finalizing the comprehensive documentation for this page.
            </p>
            <p>
              If you have any urgent inquiries regarding our {data.title.toLowerCase()}, please reach out to us directly via our <Link to="/contact" className="text-[#2563EB] font-bold hover:underline">Contact Page</Link>.
            </p>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-sm text-slate-400 font-medium">
              <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              <span>DISHA FOR INDIA</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
