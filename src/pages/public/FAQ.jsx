import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import PublicNavbar from '../../components/public/PublicNavbar';
import Footer from '../../components/public/Footer';

const faqs = [
  {
    question: "What is Disha For India?",
    answer: "Disha For India is a non-profit organization dedicated to empowering youth through skill development, education, financial literacy, wellness, environmental initiatives, and community service programs."
  },
  {
    question: "How can I become a volunteer?",
    answer: "You can join Disha For India by completing the volunteer registration form and selecting how you would like to contribute your time, skills, or expertise."
  },
  {
    question: "Who can participate in Disha For India programs?",
    answer: "Students, professionals, educators, entrepreneurs, and individuals passionate about creating social impact are welcome to participate in our initiatives."
  },
  {
    question: "What programs does Disha For India offer?",
    answer: "Our initiatives include skill development, entrepreneurship, financial literacy, emotional wellness, environmental awareness, education, and community development programs."
  },
  {
    question: "Do volunteers receive certificates?",
    answer: "Yes. Eligible volunteers receive participation or contribution certificates based on their involvement in approved activities and programs."
  },
  {
    question: "How can I support Disha For India?",
    answer: "You can support our mission by volunteering, partnering with us, participating in campaigns, or contributing to our community initiatives."
  },
  {
    question: "Where does Disha For India work?",
    answer: "Disha For India organizes programs and campaigns focused on empowering communities through education, wellness, financial literacy, environmental sustainability, and youth development across India."
  },
  {
    question: "How can I contact Disha For India?",
    answer: "You can reach us through the Contact Us page by submitting your inquiry, or by using the email address and phone number provided on the official website."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <PublicNavbar />
      
      <div className="flex-grow w-full pt-32 pb-24 px-6 relative">
        {/* Background Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 text-blue-700 text-xs font-black tracking-widest uppercase mb-4">
              Support Center
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
              Everything you need to know about DISHA, volunteering, and how to make a verifiable impact in your community.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-[#2563EB] shadow-[0_8px_30px_rgb(37,99,235,0.12)]' : 'border-[#E2E8F0] hover:border-slate-300 shadow-sm'}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none cursor-pointer"
                  >
                    <span className={`font-bold text-lg pr-8 transition-colors ${isOpen ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-blue-100 text-[#2563EB]' : 'bg-slate-50 text-slate-400'}`}>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed font-medium">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 text-center bg-[#2563EB] rounded-[32px] p-10 md:p-12 shadow-[0_20px_50px_rgb(37,99,235,0.25)] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 blur-[40px] rounded-full pointer-events-none" />
             
             <h3 className="text-3xl font-bold text-white mb-4 relative z-10">Still have questions?</h3>
             <p className="text-blue-100 mb-8 relative z-10 max-w-md mx-auto font-medium">
               Can't find the answer you're looking for? Please reach out to our friendly support team.
             </p>
             <a href="/contact" className="inline-block bg-white text-[#2563EB] font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-lg relative z-10 cursor-pointer">
               Get in touch
             </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
