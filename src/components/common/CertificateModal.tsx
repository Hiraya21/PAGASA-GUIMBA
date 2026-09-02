import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { PagasaLogo } from './PagasaLogo';
import { X, Printer, Award, ShieldCheck, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const { settings } = useApp();

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const memberName = certificate.memberName || (certificate as any).recipientName || 'Youth Member';
  const eventTitle = certificate.eventOrActivityTitle || (certificate as any).eventTitle || 'PAGASA Guimba Youth Assembly';
  const qrUrl = certificate.qrVerificationUrl || `https://pagasaguimba.org/verify/${certificate.certificateNumber}`;
  const certType = certificate.certificateType || 'Participation';
  const signatories = certificate.signatories && certificate.signatories.length > 0 
    ? certificate.signatories 
    : [
        { name: 'Gian Carlo Magat', position: 'President, PAGASA Guimba' },
        { name: 'Alyssa Nicole Valenzuela', position: 'Vice President, PAGASA Guimba' }
      ];

  const formattedDate = certificate.issueDate 
    ? (new Date(certificate.issueDate).toString() !== 'Invalid Date' 
        ? new Date(certificate.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : certificate.issueDate)
    : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 flex flex-col items-center justify-start min-h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-4 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="sticky top-0 z-20 p-4 bg-slate-900 text-white flex items-center justify-between no-print border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block leading-tight">Official Certificate Viewer</span>
              <span className="text-[11px] text-slate-400 font-mono">{certificate.certificateNumber}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer ml-1"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-4 sm:p-10 bg-slate-100 flex justify-center">
          <div className="w-full max-w-3xl border-8 border-double border-blue-950 p-6 sm:p-12 bg-white relative rounded-xs text-center shadow-lg print:border-4 print:shadow-none print:m-0 print:p-8">
            {/* Ornate corner stamps */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-blue-950" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-950" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-950" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-blue-950" />

            {/* Header / Seal */}
            <div className="flex flex-col items-center space-y-1.5 mb-5">
              <PagasaLogo size={60} showText={false} />
              <p className="text-[10px] sm:text-xs tracking-widest font-semibold uppercase text-slate-600">
                Republic of the Philippines • Province of Nueva Ecija • Municipality of Guimba
              </p>
              <h2 className="text-base sm:text-xl font-bold uppercase tracking-wider text-blue-950 font-display">
                {certificate.organization || settings.orgName}
              </h2>
              <p className="text-[11px] italic text-slate-500 font-serif">
                "{settings.tagline || 'Kabataan: Pag-asa, Dangal, at Liwanag ng Bayan'}"
              </p>
            </div>

            {/* Certificate Title */}
            <div className="my-5">
              <div className="inline-block bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 px-6 py-1.5 rounded-full border border-amber-300 shadow-xs">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-900 font-display">
                  Certificate of {certType}
                </span>
              </div>
              
              <p className="text-[11px] text-slate-500 mt-4 uppercase tracking-widest font-semibold">
                This official credential is proudly conferred to
              </p>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-blue-950 tracking-wide mt-2 border-b-2 border-amber-500/50 pb-2 inline-block px-8">
                {memberName}
              </h1>
            </div>

            {/* Body Description */}
            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed my-5 font-serif">
              {certificate.description || `For active, meritorious, and exemplary participation in the ${eventTitle} conducted by the PAGASA Guimba Youth Organization.`}
            </p>

            <div className="text-[11px] sm:text-xs text-slate-600 font-medium mb-6">
              Given this <span className="font-bold text-slate-900">{formattedDate}</span> at Guimba, Nueva Ecija, Philippines.
            </div>

            {/* Signatures & QR Code Section */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 text-left">
              {/* Signatory 1 */}
              <div className="text-center sm:text-left">
                <div className="h-9 flex items-center justify-center sm:justify-start">
                  <div className="font-serif italic text-blue-950 text-sm font-bold opacity-90 underline decoration-blue-400">
                    {signatories[0]?.name}
                  </div>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-xs font-bold text-slate-900">{signatories[0]?.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{signatories[0]?.position || (signatories[0] as any)?.title || 'President, PAGASA Guimba'}</p>
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="p-1.5 bg-white border border-slate-300 rounded-xl shadow-xs">
                  <QRCodeSVG value={qrUrl} size={64} />
                </div>
                <p className="text-[9px] font-mono font-bold text-slate-700 mt-1">
                  {certificate.certificateNumber}
                </p>
                <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 inline" /> Verified Genuine
                </span>
              </div>

              {/* Signatory 2 */}
              <div className="text-center sm:text-right">
                <div className="h-9 flex items-center justify-center sm:justify-end">
                  <div className="font-serif italic text-blue-950 text-sm font-bold opacity-90 underline decoration-blue-400">
                    {signatories[1]?.name || 'Alyssa Nicole Valenzuela'}
                  </div>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-xs font-bold text-slate-900">
                    {signatories[1]?.name || 'Alyssa Nicole Valenzuela'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {signatories[1]?.position || (signatories[1] as any)?.title || 'Vice President, PAGASA Guimba'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital QR Cryptographic Verification URL: <span className="font-mono text-[10px] text-blue-700">{qrUrl}</span></span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
