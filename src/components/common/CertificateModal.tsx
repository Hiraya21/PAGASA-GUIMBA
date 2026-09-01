import React from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { PagasaLogo } from './PagasaLogo';
import { X, Printer, Download, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const { settings } = useApp();

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-4">
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Official Certificate View & Print</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="p-6 sm:p-12 bg-white flex justify-center">
          <div className="w-full max-w-3xl border-8 border-double border-blue-900 p-8 sm:p-12 bg-amber-50/20 relative rounded-sm text-center shadow-inner">
            {/* Ornate corner stamps */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-blue-900" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-900" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-900" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-blue-900" />

            {/* Header / Seal */}
            <div className="flex flex-col items-center space-y-2 mb-6">
              <PagasaLogo size={64} showText={false} />
              <p className="text-xs tracking-widest font-semibold uppercase text-slate-600">
                Republic of the Philippines • Municipality of Guimba, Nueva Ecija
              </p>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-blue-950 font-display">
                {settings.orgName}
              </h2>
              <p className="text-xs italic text-slate-500 font-serif">
                "{settings.tagline}"
              </p>
            </div>

            {/* Certificate Title */}
            <div className="my-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/80 px-4 py-1 rounded-full border border-amber-300">
                Certificate of {certificate.certificateType}
              </span>
              <p className="text-xs text-slate-500 mt-3 uppercase tracking-wider">This is proudly presented to</p>
              
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-blue-900 tracking-wide mt-2 border-b-2 border-amber-500/40 pb-2 inline-block px-8">
                {certificate.memberName}
              </h1>
            </div>

            {/* Body Description */}
            <p className="text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed my-6 font-serif">
              {certificate.description}
            </p>

            <div className="text-xs text-slate-600 font-semibold mb-8">
              Given this <span className="font-bold text-slate-900">{new Date(certificate.issueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span> at Guimba, Nueva Ecija, Philippines.
            </div>

            {/* Signatures & QR Code Section */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 text-left">
              {/* Signatory 1 */}
              <div className="text-center sm:text-left">
                <div className="h-10 flex items-center justify-center sm:justify-start">
                  <div className="font-serif italic text-blue-900 text-sm font-bold opacity-80 underline decoration-blue-400">
                    {certificate.signatories[0]?.name}
                  </div>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-xs font-bold text-slate-900">{certificate.signatories[0]?.name}</p>
                  <p className="text-[10px] text-slate-500">{certificate.signatories[0]?.position}</p>
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="p-1.5 bg-white border border-slate-300 rounded-lg shadow-sm">
                  <QRCodeSVG value={certificate.qrVerificationUrl} size={64} />
                </div>
                <p className="text-[9px] font-mono text-slate-500 mt-1">
                  {certificate.certificateNumber}
                </p>
                <span className="text-[9px] text-emerald-700 flex items-center gap-0.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 inline" /> Verified Authenticity
                </span>
              </div>

              {/* Signatory 2 */}
              <div className="text-center sm:text-right">
                <div className="h-10 flex items-center justify-center sm:justify-end">
                  <div className="font-serif italic text-blue-900 text-sm font-bold opacity-80 underline decoration-blue-400">
                    {certificate.signatories[1]?.name || 'Alyssa Nicole Valenzuela'}
                  </div>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="text-xs font-bold text-slate-900">
                    {certificate.signatories[1]?.name || 'Alyssa Nicole Valenzuela'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {certificate.signatories[1]?.position || 'Vice President, PAGASA Guimba'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
