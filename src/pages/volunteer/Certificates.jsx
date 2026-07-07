import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Award, Download, ShieldCheck, Printer } from "lucide-react";

export default function Certificates() {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="glass-card p-6 bg-white space-y-6">
      <div>
        <h3 className="font-bold text-slate-800 text-lg">My Certificates</h3>
        <p className="text-slate-400 text-xs mt-1">
          Download and share verified appreciation certificates issued upon campaign completion.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3 py-6">
          <div className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Award className="h-12 w-12 text-slate-300 mb-2" />
          <span className="text-sm font-medium text-slate-400">No certificates issued yet.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-snug">{cert.programTitle}</h4>
                <p className="text-[10px] text-slate-400 mt-1">Number: {cert.certificateNumber}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Issued: {cert.issuedAt?.seconds ? new Date(cert.issuedAt.seconds * 1000).toLocaleDateString() : "Recently"}</p>
              </div>

              <button
                onClick={() => handlePrint(cert)}
                className="flex items-center justify-center gap-1.5 w-full rounded-2xl bg-white border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-xs"
              >
                <Printer className="h-4 w-4 text-slate-500" />
                View & Print PDF
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
