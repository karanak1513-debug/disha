import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Award, ShieldCheck, Printer, Search, Medal, Ribbon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Certificates() {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "certificates"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCertificates(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handlePrint = (cert) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${cert.certificateNumber}</title>
          <style>
            body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fafafa; }
            .cert-container { border: 15px solid #F26522; padding: 40px; background: white; width: 750px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 8px; position: relative; }
            .header { font-size: 26px; color: #1F2937; font-weight: bold; text-transform: uppercase; margin-bottom: 20px; }
            .sub { font-size: 14px; color: #6b7280; margin-bottom: 30px; letter-spacing: 1px; }
            .name { font-size: 32px; color: #F26522; font-weight: 800; border-bottom: 2px solid #e5e7eb; display: inline-block; padding-bottom: 5px; margin-bottom: 20px; }
            .body { font-size: 15px; color: #374151; line-height: 1.8; margin-bottom: 40px; }
            .footer-info { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; border-t: 1px solid #eee; padding-top: 20px; }
            .sign { font-size: 13px; font-weight: bold; color: #1f2937; }
            .sign-title { font-size: 11px; color: #6b7280; }
            .verified { border: 2px solid #10b981; color: #10b981; display: inline-block; padding: 5px 12px; font-size: 10px; font-weight: bold; border-radius: 5px; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="cert-container">
            <div class="header">Certificate of Appreciation</div>
            <div class="sub">DISHA FOR INDIA VOLUNTEER NETWORK</div>
            <div class="body">This is proudly presented to</div>
            <div class="name">${cert.userName}</div>
            <div class="body">
              for outstanding dedication and active service in the <strong>${cert.programTitle}</strong> campaign.<br/>
              Your voluntary service of <strong>${cert.hours || 10} hours</strong> is highly appreciated.
            </div>
            <div class="footer-info">
              <div>
                <span class="verified">VERIFIED SECURITY QR</span><br/>
                <small style="color: #9ca3af; font-size: 9px; display: block; margin-top: 5px;">ID: ${cert.certificateNumber}</small>
              </div>
              <div>
                <div class="sign">Pradeep Rawat</div>
                <div class="sign-title">National Director, DISHA</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredCertificates = certificates.filter(c => 
    c.programTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.certificateNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-4">
      {/* ── PROFESSIONAL PAGE HEADER ── */}
      <div className="-mt-6 -mx-6 mb-8 bg-white border-b border-[#E5E7EB] px-6 md:px-8 py-8 h-auto md:min-h-[100px] flex items-center relative overflow-hidden">
        {/* Subtle animated background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-10 right-1/4 w-64 h-64 bg-teal-100/30 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <div className="w-full flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
          {/* Left Column */}
          <div className="space-y-3">
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className="flex items-center gap-2 text-[14px] font-medium text-slate-500">
              <Link to="/dashboard" className="hover:text-slate-800 transition-colors">Volunteer</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-800 font-semibold">Certificates</span>
            </motion.div>
            

          </div>

          {/* Right Column: Actions & Stats */}
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 bg-white border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Ribbon className="h-3 w-3" /> Total Earned
                </span>
                <span className="text-lg font-black text-slate-800 leading-none mt-1">{certificates.length}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BENTO BOX CONTAINER ── */}
      <motion.div variants={fadeUp} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Header toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Award className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Certificate Wallet</h3>
              <p className="text-[10px] text-slate-500 font-medium">Your verified credentials</p>
            </div>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 block pl-9 p-2.5 transition-all outline-none"
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50/30">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white border border-slate-100 rounded-xl animate-pulse" />)}
            </div>
          ) : filteredCertificates.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center bg-white border border-dashed border-slate-200 rounded-xl">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <Medal className="h-7 w-7 text-slate-300" />
              </div>
              <p className="font-bold text-slate-600 text-sm mb-1">
                {searchQuery ? "No matching certificates" : "No certificates issued yet"}
              </p>
              <p className="text-slate-400 text-xs">
                {searchQuery ? "Try a different search term." : "Complete volunteering programs to earn certificates."}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCertificates.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg hover:border-emerald-200 cursor-default"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 shadow-sm">
                      <Award className="h-6 w-6 text-emerald-600" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-600 uppercase tracking-wider shadow-sm">
                      <ShieldCheck className="h-2.5 w-2.5" /> Verified
                    </span>
                  </div>

                  <div className="mb-5 flex-1">
                    <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2" title={cert.programTitle}>
                      {cert.programTitle}
                    </h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] text-slate-400 font-medium">ID: <span className="text-slate-500 font-bold">{cert.certificateNumber}</span></p>
                      <p className="text-[10px] text-slate-400 font-medium">Issued: <span className="text-slate-500 font-bold">{cert.issuedAt?.seconds ? new Date(cert.issuedAt.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}</span></p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePrint(cert)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#0A2540] py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-sm transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print PDF
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
