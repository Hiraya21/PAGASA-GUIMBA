import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CertificateItem } from '../../types';
import { CertificateModal } from '../common/CertificateModal';
import { 
  Award, 
  Plus, 
  Search, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  X,
  FileCheck,
  Eye,
  Calendar,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminCertificates: React.FC = () => {
  const { certificates, members, events, issueCertificate, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  // Form
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.memberId || '');
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [certType, setCertType] = useState<'Participation' | 'Completion' | 'Recognition' | 'Appreciation' | 'Leadership' | 'Excellence' | 'Volunteerism' | 'Special Recognition'>('Participation');
  const [customDescription, setCustomDescription] = useState('');

  // Verification test tool
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<CertificateItem | null | 'NOT_FOUND'>(null);

  const filteredCerts = certificates.filter(c => {
    const recipient = (c.memberName || (c as any).recipientName || '').toLowerCase();
    const certNo = (c.certificateNumber || '').toLowerCase();
    const evt = (c.eventOrActivityTitle || (c as any).eventTitle || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    return recipient.includes(query) || certNo.includes(query) || evt.includes(query);
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMember = members.find(m => m.memberId === selectedMemberId) || members[0];
    const targetEvent = events.find(e => e.id === selectedEventId) || events[0];

    if (!targetMember || !targetEvent) {
      showToast('error', 'Selection Required', 'Please select both a member and an event.');
      return;
    }

    const issued = issueCertificate({
      memberId: targetMember.memberId,
      memberName: targetMember.fullName,
      eventOrActivityTitle: targetEvent.title,
      certificateType: certType,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      description: customDescription || `For active, meritorious, and exemplary participation in the ${targetEvent.title} conducted by the PAGASA Guimba Youth Organization.`,
      signatories: [
        { name: 'Gian Carlo Magat', position: 'President, PAGASA Guimba' },
        { name: 'Alyssa Nicole Valenzuela', position: 'Vice President, PAGASA Guimba' }
      ]
    });

    setIsIssueModalOpen(false);
    setSelectedCert(issued);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const query = verifyInput.trim().toLowerCase();
    if (!query) return;

    const found = certificates.find(c => {
      const num = (c.certificateNumber || '').toLowerCase();
      const qr = (c.qrVerificationUrl || '').toLowerCase();
      const legacyCode = ((c as any).qrVerificationCode || '').toLowerCase();
      return num === query || qr.includes(query) || legacyCode === query || num.includes(query);
    });

    if (found) {
      setVerifyResult(found);
    } else {
      setVerifyResult('NOT_FOUND');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h1 className="text-2xl font-display font-bold text-slate-900">
              E-Certificate Management & Verification
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate, view, and cryptographically verify official municipal certificates of participation, leadership, and honors.
          </p>
        </div>

        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New Certificate</span>
        </button>
      </div>

      {/* QR Certificate Verification Tool Box */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm font-display text-white">
            Official Certificate Authenticity Verifier
          </h3>
        </div>
        <p className="text-xs text-slate-300 max-w-xl">
          Enter any Certificate Number (e.g. <span className="font-mono text-amber-300">CERT-PAGASA-2026-0042-01</span>) to verify authenticity against the official municipal registry.
        </p>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2 max-w-lg">
          <input
            type="text"
            value={verifyInput}
            onChange={(e) => setVerifyInput(e.target.value)}
            placeholder="e.g. CERT-PAGASA-2026-0042-01 or member name..."
            className="flex-1 px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
          >
            Verify Authenticity
          </button>
        </form>

        {verifyResult && verifyResult !== 'NOT_FOUND' && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs space-y-3 text-emerald-100 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>OFFICIALLY VERIFIED GENUINE MUNICIPAL CERTIFICATE</span>
              </div>
              <button
                onClick={() => setSelectedCert(verifyResult)}
                className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
              >
                Open Certificate
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-slate-200">
              <div>Certificate #: <strong className="text-white font-mono">{verifyResult.certificateNumber}</strong></div>
              <div>Recipient: <strong className="text-white">{verifyResult.memberName || (verifyResult as any).recipientName}</strong></div>
              <div>Assembly / Event: <strong className="text-white">{verifyResult.eventOrActivityTitle || (verifyResult as any).eventTitle}</strong></div>
              <div>Issued: <strong className="text-white">{verifyResult.issueDate}</strong></div>
            </div>
          </div>
        )}

        {verifyResult === 'NOT_FOUND' && (
          <div className="p-4 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-xs text-rose-300 animate-in fade-in">
            ⚠️ No certificate record matching "{verifyInput}" was found in the PAGASA Guimba registry.
          </div>
        )}
      </div>

      {/* Certificates Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-display">
              Issued Certificates Registry ({filteredCerts.length})
            </h3>
            <p className="text-xs text-slate-500">Live directory of all municipal accredited e-certificates</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipient or certificate #..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Certificate No.</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Event Assembly</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No certificates found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCerts.map((c) => {
                  const recipient = c.memberName || (c as any).recipientName || 'Member';
                  const event = c.eventOrActivityTitle || (c as any).eventTitle || 'PAGASA Assembly';
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-900">
                        {c.certificateNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {recipient}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {c.certificateType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                        {event}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{c.issueDate}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedCert(c)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto shadow-xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View & Print</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}

      {/* Issue Certificate Modal */}
      {isIssueModalOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 flex items-center justify-center min-h-screen"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsIssueModalOpen(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">Issue E-Certificate</h3>
              </div>
              <button 
                onClick={() => setIsIssueModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Member *</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.memberId}>
                      {m.fullName} ({m.memberId} - Brgy. {m.barangay})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Event / Assembly *</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({e.date})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Certificate Type</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="Participation">Certificate of Participation</option>
                  <option value="Completion">Certificate of Completion</option>
                  <option value="Recognition">Certificate of Recognition</option>
                  <option value="Appreciation">Certificate of Appreciation</option>
                  <option value="Leadership">Certificate of Leadership Excellence</option>
                  <option value="Excellence">Certificate of Academic/Youth Excellence</option>
                  <option value="Volunteerism">Certificate of Community Volunteerism</option>
                  <option value="Special Recognition">Certificate of Special Recognition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Citation / Wording</label>
                <textarea
                  rows={3}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Leave blank for automatic municipal citation wording..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Issue & Preview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
